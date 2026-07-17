"use client";

import { useState, useEffect, useRef } from "react";
import { CardElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Lock, AlertCircle } from "lucide-react";
import type { PaymentRequest } from "@stripe/stripe-js";

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddressInfo {
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
}

interface CartItem {
  id?: string;
  slug?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface StripePaymentFormProps {
  amount: number;           // total в евро
  subtotal?: number;        // в евро
  shipping?: number;        // в евро
  orderId: string;
  customerEmail: string;
  customer?: CustomerInfo;
  address?: AddressInfo;
  items?: CartItem[];
  onSuccess: () => void;
}

export function StripePaymentForm({
  amount,
  subtotal,
  shipping,
  orderId,
  customerEmail,
  customer,
  address,
  items,
  onSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [prButton, setPrButton] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "FR",
      currency: "eur",
      total: {
        label: "Total",
        amount: Math.round(amount * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestShipping: false,
    });

    pr.on("paymentmethod", async (e) => {
      try {
        setLoading(true);
        setError(null);

        const payload = {
          orderId,
          customer: customer || { email: customerEmail },
          address,
          items: items?.map((it) => ({
            id: it.id,
            slug: it.slug,
            name: it.name,
            image: it.image,
            price: it.price,
            quantity: it.quantity,
          })),
          subtotal: subtotal ?? amount,
          shipping: shipping ?? 0,
          total: amount,
          amount: Math.round(amount * 100),
          customerEmail,
        };

        const response = await fetch("/.netlify/functions/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          e.complete("fail");
          setError(data.error || "Erreur de paiement");
          return;
        }

        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: e.paymentMethod.id,
        });

        if (result.error) {
          e.complete("fail");
          setError(result.error.message || "Erreur de paiement");
        } else if (result.paymentIntent?.status === "succeeded") {
          e.complete("success");
          onSuccess();
        }
      } catch (err) {
        e.complete("fail");
        const message = err instanceof Error ? err.message : "Une erreur s'est produite";
        setError(message);
      } finally {
        setLoading(false);
      }
    });

    pr.canMakePayment().then((res) => {
      if (res) {
        setPrButton(true);
        setPaymentRequest(pr);
      } else {
        setPrButton(false);
      }
    });
  }, [stripe, amount, orderId, customer, address, items, subtotal, shipping, customerEmail, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe n'est pas chargé. Veuillez actualiser la page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        orderId,
        customer: customer || { email: customerEmail },
        address,
        items: items?.map((it) => ({
          id: it.id,
          slug: it.slug,
          name: it.name,
          image: it.image,
          price: it.price,
          quantity: it.quantity,
        })),
        subtotal: subtotal ?? amount,
        shipping: shipping ?? 0,
        total: amount,
        // Legacy
        amount: Math.round(amount * 100),
        customerEmail,
      };

      console.log("📤 Envoi au serveur:", { orderId, total: amount, itemsCount: items?.length });

      const response = await fetch("/.netlify/functions/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}`);
      }

      if (!data.clientSecret) {
        throw new Error(data.error || "Pas de clientSecret reçu");
      }

      // Подтверждение платежа с billing_details
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: customer ? `${customer.firstName} ${customer.lastName}`.trim() : undefined,
            email: customerEmail,
            phone: customer?.phone,
            address: address
              ? {
                  line1: address.line1,
                  line2: address.line2,
                  postal_code: address.postalCode,
                  city: address.city,
                  country: address.country || "FR",
                }
              : undefined,
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Erreur de paiement");
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Une erreur s'est produite";
      console.error("Erreur paiement:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {prButton && paymentRequest && (
        <>
          <div className="p-5 rounded-2xl border-2 border-coral/20 bg-coral/5">
            <p className="text-xs text-navy/60 mb-3 font-semibold">💳 Paiement rapide</p>
            <PaymentRequestButtonElement
              options={{ paymentRequest }}
              onReady={() => {}}
            />
          </div>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-navy/10" />
            <span className="text-xs text-navy/40 font-semibold">OU</span>
            <div className="flex-1 h-px bg-navy/10" />
          </div>
        </>
      )}

      <div className="p-5 rounded-2xl border-2 border-navy/10">
        <label className="block text-sm font-semibold text-navy mb-3">
          Numéro de carte
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1a3a52",
                "::placeholder": {
                  color: "#9ca3af",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || loading}
        size="lg"
        className="w-full"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Traitement..." : `Payer ${formatPrice(amount)}`}
      </Button>

      <p className="text-xs text-navy/50 text-center">
        🔒 Paiement sécurisé par Stripe · {prButton ? "Apple Pay • Google Pay • Carte" : "Carte bancaire"}
      </p>
    </form>
  );
}
