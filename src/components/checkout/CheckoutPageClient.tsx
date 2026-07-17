"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutView } from "./CheckoutView";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export function CheckoutPageClient() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutView />
    </Elements>
  );
}
