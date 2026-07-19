import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Инициализация Stripe
let stripe: Stripe | null = null;
let stripeInitialized = false;

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

  try {
    // Проверяем что Stripe инициализирован
    if (!stripe) {
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
    const { amount, orderId, customerEmail } = body;

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

    // Создаём Payment Intent в Stripe
    const paymentIntent = await getStripe().paymentIntents.create({
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
