import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Pool } from "pg";

// Инициализация Stripe
let stripe: Stripe | null = null;
let stripeInitialized = false;

// Пул для Постпрес

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;
  
  let DB_URL = process.env.DATABASE_URL;
  
  if (!DB_URL) {
    const pgHost = process.env.PGHOST;
    const pgPort = process.env.PGPORT || '5432';
    const pgUser = process.env.PGUSER;
    const pgPassword = process.env.PGPASSWORD;
    const pgDatabase = process.env.PGDATABASE || 'railway';
    
    if (pgHost && pgUser && pgPassword) {
      DB_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    }
  }
  
  if (!DB_URL) {
    throw new Error('DATABASE_URL not set');
  }
  
  pool = new Pool({
    connectionString: DB_URL,
    max: 5,
  });
  
  return pool;
}

function getStripe(): Stripe {
  if (!stripeInitialized) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY not found in environment');
    }
    
    try {
      stripe = new Stripe(stripeSecretKey);
      stripeInitialized = true;
      console.log("[INIT] ✅ Stripe initialized successfully");
    } catch (err: any) {
      console.error("[INIT] ❌ Failed to initialize Stripe:", err.message);
      throw err;
    }
  }
  
  if (!stripe) {
    throw new Error('Stripe initialization failed');
  }
  
  return stripe;
}

export async function POST(request: NextRequest) {
  console.log("\n[POST] Payment Intent request received");
  console.log("[POST] Time:", new Date().toISOString());

  try {
    // Проверяем что Stripe инициализирован
    let stripeInstance: Stripe;
    try {
      stripeInstance = getStripe();
    } catch (err: any) {
      console.error("[ERROR] Failed to initialize Stripe:", err.message);
      return NextResponse.json(
        {
          error: "Stripe initialization failed",
          message: "STRIPE_SECRET_KEY not available or invalid"
        },
        { status: 500 }
      );
    }

    if (!stripeInstance) {
      console.error("[ERROR] Stripe not initialized");
      return NextResponse.json(
        {
          error: "Stripe not configured",
          message: "STRIPE_SECRET_KEY not available"
        },
        { status: 500 }
      );
    }

    // Получаем данные из запроса
    const body = await request.json();
    const { amount, orderId, customerEmail, userId, items } = body;

    console.log("[POST] Request data:", { 
      amount, 
      orderId, 
      email: customerEmail 
    });

    // Валидируем данные
    if (!amount || amount <= 0) {
      console.error("[VALIDATION] Invalid amount:", amount);
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!orderId) {
      console.error("[VALIDATION] Missing orderId");
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      console.error("[VALIDATION] Missing customerEmail");
      return NextResponse.json(
        { error: "Missing customerEmail" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount);
    const amountInEuros = (amountInCents / 100).toFixed(2);

    console.log(`[POST] Creating Payment Intent: €${amountInEuros}`);

    // Create or update order in database
    console.log(`[POST] Creating/updating order in database: ${orderId}`);
    const dbPool = getPool();
    const dbClient = await dbPool.connect();

    try {
      // Create order if not exists
      const itemsJson = items ? JSON.stringify(items) : null;
      await dbClient.query(
        `INSERT INTO orders (id, customer_email, user_id, total_amount, status, items, items_count, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'pending', $5, $6, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET 
           customer_email = $2,
           user_id = $3,
           total_amount = $4,
           items = $5,
           items_count = $6,
           updated_at = NOW()`,
        [orderId, customerEmail, userId || null, amountInCents / 100, itemsJson, items?.length || 0]
      );
      console.log(`[POST] ✅ Order created/updated in database`);

      // Create order items if provided
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const itemId = `${orderId}-${item.productId}`;
          await dbClient.query(
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
        }
        console.log(`[POST] ✅ Created ${items.length} order items`);
      }
    } finally {
      dbClient.release();
    }

    // Создаём Payment Intent в Stripe
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      receipt_email: customerEmail,
      metadata: {
        orderId: String(orderId),
        customerEmail: String(customerEmail),
      },
    });

    console.log("[POST] ✅ Payment Intent created successfully");
    console.log("[POST] Intent ID:", paymentIntent.id);
    console.log("[POST] Intent status:", paymentIntent.status);

    // Update order with payment intent ID
    const dbClient2 = await dbPool.connect();
    try {
      await dbClient2.query(
        `UPDATE orders SET payment_intent_id = $1, updated_at = NOW() WHERE id = $2`,
        [paymentIntent.id, orderId]
      );
      console.log(`[POST] ✅ Order updated with payment_intent_id`);
    } finally {
      dbClient2.release();
    }

    // Возвращаем clientSecret для фронтенда
    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error: any) {
    console.error("\n[ERROR] Exception in payment processing");
    console.error("[ERROR] Error type:", error.type || error.constructor.name);
    console.error("[ERROR] Error message:", error.message);

    if (error.type === "StripeAuthenticationError") {
      console.error("[ERROR] ⚠️  Stripe authentication failed - check API key");
    }

    return NextResponse.json(
      {
        error: "Payment processing failed",
        message: error.message,
        type: error.type,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
