"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, CreditCard, Truck, User, ShoppingBag, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const STEPS = [
  { id: 1, label: "Coordonnées", Icon: User },
  { id: 2, label: "Livraison", Icon: Truck },
  { id: 3, label: "Paiement", Icon: CreditCard },
  { id: 4, label: "Confirmation", Icon: Check },
];

export function CheckoutView() {
  const [step, setStep] = useState(1);
  const lines = useCart((s) => s.getLines());
  const subtotal = useCart((s) => s.getSubtotal());
  const shipping = useCart((s) => s.getShipping());
  const total = useCart((s) => s.getTotal());
  const clear = useCart((s) => s.clear);

  const submit = () => {
    if (step < 4) {
      setStep(step + 1);
      if (step === 3) {
        // TODO: appel réel à l'API de paiement (Stripe / Adyen / etc.)
        clear();
      }
    }
  };

  if (lines.length === 0 && step < 4) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="w-16 h-16 text-navy/20 mx-auto mb-4" />
        <h2 className="font-display font-bold text-navy text-2xl mb-3">
          Votre panier est vide
        </h2>
        <p className="text-navy/60 mb-6">
          Ajoutez d'abord des produits à votre panier avant de commander.
        </p>
        <Button asChild>
          <Link href="/boutique">Retour à la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
      <div>
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "h-11 w-11 rounded-full inline-flex items-center justify-center transition-colors",
                      step >= s.id
                        ? "bg-coral text-white shadow-pop"
                        : "bg-white border-2 border-navy/10 text-navy/40",
                    )}
                  >
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold hidden sm:block",
                      step >= s.id ? "text-navy" : "text-navy/40",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-[3px] mx-2 rounded-full bg-navy/10 overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ width: step > s.id ? "100%" : "0%" }}
                      className="h-full bg-coral"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <StepContact />}
              {step === 2 && <StepShipping />}
              {step === 3 && <StepPayment />}
              {step === 4 && <StepConfirmation />}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-navy/5">
              {step > 1 ? (
                <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="w-4 h-4" /> Retour
                </Button>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/panier"><ArrowLeft className="w-4 h-4" /> Panier</Link>
                </Button>
              )}
              <Button size="lg" onClick={submit}>
                {step === 3 ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Payer {formatPrice(total)}
                  </>
                ) : (
                  <>Continuer <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {step < 4 && (
        <aside className="lg:sticky lg:top-24 bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-display font-bold text-navy text-lg mb-4">Votre commande</h2>
          <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {lines.map((line) => (
              <li key={line.productId} className="flex items-center gap-3">
                <span className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0", line.product.bgClass)}>
                  {line.product.images[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm line-clamp-1">{line.product.name}</p>
                  <p className="text-xs text-navy/60">Qté : {line.quantity}</p>
                </div>
                <span className="font-bold text-navy text-sm">
                  {formatPrice(line.product.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-navy/10 space-y-2 text-sm">
            <div className="flex justify-between text-navy/70">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-navy/70">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Gratuite" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-navy/5">
              <span className="font-display font-bold text-navy">Total</span>
              <span className="font-display font-bold text-navy">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full h-12 px-4 rounded-2xl border-2 border-navy/10 text-navy focus:outline-none focus:border-coral transition-colors"
      />
    </div>
  );
}

function StepContact() {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-6">Vos coordonnées</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Prénom" placeholder="Sophie" />
        <Field label="Nom" placeholder="Martin" />
        <div className="sm:col-span-2">
          <Field label="Email" type="email" placeholder="sophie@email.com" />
        </div>
        <div className="sm:col-span-2">
          <Field label="Téléphone" type="tel" placeholder="+33 6 12 34 56 78" />
        </div>
      </div>
    </div>
  );
}

function StepShipping() {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-6">Adresse de livraison</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Adresse" placeholder="12 rue de la Paix" />
        </div>
        <Field label="Code postal" placeholder="75002" />
        <Field label="Ville" placeholder="Paris" />
        <div className="sm:col-span-2">
          <Field label="Pays" defaultValue="France" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <h3 className="font-display font-bold text-navy mb-3">Mode de livraison</h3>
        {[
          { id: "standard", label: "Standard (48-72h)", price: "Gratuit dès 49 €" },
          { id: "express", label: "Express (24h)", price: "+ 6,90 €" },
          { id: "pickup", label: "Point relais", price: "3,90 €" },
        ].map((opt, i) => (
          <label
            key={opt.id}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 border-navy/10 hover:border-coral cursor-pointer transition-colors"
          >
            <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-coral" />
            <div className="flex-1">
              <p className="font-semibold text-navy">{opt.label}</p>
            </div>
            <span className="font-bold text-navy text-sm">{opt.price}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StepPayment() {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-2">Paiement sécurisé</h2>
      <p className="text-navy/60 text-sm mb-6 inline-flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" /> Vos données de carte ne sont pas stockées sur nos serveurs.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {["Carte bancaire", "Apple Pay", "PayPal"].map((m, i) => (
          <label
            key={m}
            className="p-4 rounded-2xl border-2 border-navy/10 hover:border-coral cursor-pointer transition-colors flex items-center gap-3 has-[:checked]:border-coral has-[:checked]:bg-coral/5"
          >
            <input type="radio" name="pay" defaultChecked={i === 0} className="accent-coral" />
            <span className="font-semibold text-navy text-sm">{m}</span>
          </label>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Numéro de carte" placeholder="1234 5678 9012 3456" />
        </div>
        <Field label="Date d'expiration" placeholder="MM/AA" />
        <Field label="Cryptogramme" placeholder="123" />
      </div>
    </div>
  );
}

function StepConfirmation() {
  return (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-full bg-mint/20 mx-auto mb-6 inline-flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-mint" strokeWidth={3} />
      </motion.div>
      <h2 className="font-display font-bold text-navy text-3xl mb-3">
        Merci pour votre commande !
      </h2>
      <p className="text-navy/70 mb-2 max-w-md mx-auto">
        Un email de confirmation vous a été envoyé. Votre colis arrive bientôt&nbsp;! 📦
      </p>
      <p className="text-sm text-navy/50 mb-8">
        Numéro de commande : <span className="font-bold text-navy">#MBAJ-2026-00042</span>
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild variant="secondary">
          <Link href="/compte/commandes">Suivre ma commande</Link>
        </Button>
        <Button asChild>
          <Link href="/boutique">Continuer les achats</Link>
        </Button>
      </div>
    </div>
  );
}
