// This route must be dynamic (not static) since it handles runtime webhooks
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

// Lazy initialize Stripe
let stripe: Stripe | null = null;
let stripeInitialized = false;

function getStripe(): Stripe {
  if (!stripeInitialized) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }
    stripe = new Stripe(key);
    stripeInitialized = true;
  }
  if (!stripe) {
    throw new Error('Stripe initialization failed');
  }
  return stripe;
}

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  let DB_URL = process.env.DATABASE_URL;

  if (!DB_URL) {
    const pgHost = process.env.PGHOST;
    const pgPort = process.env.PGPORT || "5432";
    const pgUser = process.env.PGUSER;
    const pgPassword = process.env.PGPASSWORD;
    const pgDatabase = process.env.PGDATABASE || "railway";

    if (pgHost && pgUser && pgPassword) {
      DB_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    }
  }

  if (!DB_URL) {
    throw new Error(
      "DATABASE_URL not set and could not construct from PGHOST/PGUSER/PGPASSWORD"
    );
  }

  pool = new Pool({
    connectionString: DB_URL,
    max: 5,
  });

  return pool;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log("\n[WEBHOOK] Stripe webhook received");
  console.log("[WEBHOOK] Signature:", signature ? "✓ Present" : "✗ Missing");

  // Verify webhook signature
  let event: Stripe.Event;

  try {
    if (!WEBHOOK_SECRET) {
      console.error("[WEBHOOK] ❌ STRIPE_WEBHOOK_SECRET not configured");
      throw new Error("STRIPE_WEBHOOK_SECRET not configured");
    }

    if (!signature) {
      console.error("[WEBHOOK] ❌ No stripe-signature header");
      throw new Error("No stripe-signature header");
    }

    event = getStripe().webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
    console.log(`[WEBHOOK] ✅ Signature verified, event type: ${event.type}`);
  } catch (err: any) {
    console.error("[WEBHOOK] ❌ Signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    console.log(`[WEBHOOK] Processing event: ${event.type}`);
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`[WEBHOOK] ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[WEBHOOK] ❌ Error processing event:", err.message);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`\n[PAYMENT SUCCESS] Payment Intent: ${paymentIntent.id}`);
  console.log(`[PAYMENT SUCCESS] Amount: ${paymentIntent.amount / 100} EUR`);
  console.log(`[PAYMENT SUCCESS] Customer Email: ${paymentIntent.receipt_email}`);
  console.log(`[PAYMENT SUCCESS] Metadata:`, paymentIntent.metadata);

  const { orderId, customerEmail } = paymentIntent.metadata as {
    orderId: string;
    customerEmail: string;
  };

  if (!orderId || !customerEmail) {
    console.error("[PAYMENT SUCCESS] ❌ Missing metadata (orderId or customerEmail)");
    return;
  }

  try {
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Update order status to completed
      const result = await client.query(
        `UPDATE orders 
         SET status = 'completed', 
             payment_intent_id = $1,
             updated_at = NOW()
         WHERE id = $2 AND status = 'pending'
         RETURNING id, customer_email, total_amount`,
        [paymentIntent.id, orderId]
      );

      if (result.rows.length === 0) {
        console.warn(`[PAYMENT SUCCESS] ⚠️ Order not found or already processed: ${orderId}`);
        return;
      }

      const order = result.rows[0];
      console.log(`[PAYMENT SUCCESS] ✅ Order updated: ${order.id}`);

      // Get order items from orders table (they were stored as JSON)
      const orderDetailsResult = await client.query(
        `SELECT items, customer_name FROM orders WHERE id = $1`,
        [orderId]
      );

      if (orderDetailsResult.rows.length > 0 && orderDetailsResult.rows[0].items) {
        const items = orderDetailsResult.rows[0].items;
        console.log(`[PAYMENT SUCCESS] Creating order items...`);

        for (const item of items) {
          const itemId = `${orderId}-${item.productId}`;
          try {
            await client.query(
              `INSERT INTO order_items (id, order_id, product_id, product_name, price, quantity, total)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT DO NOTHING`,
              [
                itemId,
                orderId,
                item.productId,
                item.productName || item.name,
                item.price,
                item.quantity,
                item.price * item.quantity,
              ]
            );
          } catch (err) {
            console.warn(`[PAYMENT SUCCESS] Warning creating item: ${(err as Error).message}`);
          }
        }

        console.log(`[PAYMENT SUCCESS] ✅ Created order items for order ${orderId}`);
      }

      // Send confirmation email (lazy load to avoid build-time errors)
      try {
        const { sendOrderConfirmation } = await import('@/lib/email');
        const items = orderDetailsResult.rows[0].items || [];
        if (items.length > 0) {
          await sendOrderConfirmation(
            order.customer_email,
            order.customer_name || 'Valued Customer',
            orderId,
            items,
            order.total_amount
          );
          console.log(`[PAYMENT SUCCESS] ✅ Confirmation email sent to ${order.customer_email}`);
        }
      } catch (emailErr: any) {
        console.error(`[PAYMENT SUCCESS] ⚠️ Failed to send confirmation email:`, emailErr.message);
        // Don't throw - order was successful, email is not critical
      }

      // TODO: Update inventory (phase 2)
      // TODO: Create shipping label (phase 2)
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[PAYMENT SUCCESS] ❌ Database error:", err.message);
    throw err;
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`\n[PAYMENT FAILED] Payment Intent: ${paymentIntent.id}`);
  console.log(`[PAYMENT FAILED] Error: ${paymentIntent.last_payment_error?.message}`);
  console.log(`[PAYMENT FAILED] Metadata:`, paymentIntent.metadata);

  const { orderId } = paymentIntent.metadata as { orderId: string };

  if (!orderId) {
    console.error("[PAYMENT FAILED] ❌ Missing orderId in metadata");
    return;
  }

  try {
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Update order status to failed
      const result = await client.query(
        `UPDATE orders 
         SET status = 'failed', 
             notes = $1,
             updated_at = NOW()
         WHERE id = $2 AND status = 'pending'
         RETURNING id`,
        [paymentIntent.last_payment_error?.message || "Payment failed", orderId]
      );

      if (result.rows.length > 0) {
        console.log(`[PAYMENT FAILED] ✅ Order marked as failed: ${orderId}`);
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[PAYMENT FAILED] ❌ Database error:", err.message);
  }
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`\n[REFUND] Charge refunded: ${charge.id}`);
  console.log(`[REFUND] Refunded amount: ${charge.amount_refunded / 100} EUR`);

  if (!charge.payment_intent) {
    console.warn("[REFUND] ⚠️ No payment_intent associated with charge");
    return;
  }

  try {
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      // Find order by payment intent ID
      const result = await client.query(
        `SELECT id FROM orders WHERE payment_intent_id = $1 LIMIT 1`,
        [charge.payment_intent as string]
      );

      if (result.rows.length > 0) {
        const orderId = result.rows[0].id;

        // Update order status to refunded
        await client.query(
          `UPDATE orders 
           SET status = 'refunded',
               notes = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [`Refunded ${charge.amount_refunded / 100} EUR`, orderId]
        );

        console.log(`[REFUND] ✅ Order marked as refunded: ${orderId}`);

        // TODO: Restore inventory
        console.log(`[REFUND] TODO: Restore inventory for order ${orderId}`);
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("[REFUND] ❌ Database error:", err.message);
  }
}

// Explicit OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
