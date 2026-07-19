"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutView } from "./CheckoutView";

const getStripePromise = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  if (!key) {
    console.warn('[STRIPE] Public key not configured');
    return null;
  }
  return loadStripe(key);
};

const stripePromise = getStripePromise();

export function CheckoutPageClient() {
  if (!stripePromise) {
    return (
      <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Payment Not Available</h3>
        <p className="text-yellow-700 text-sm">
          Stripe is not configured. Checkout will be enabled soon.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutView />
    </Elements>
  );
}
