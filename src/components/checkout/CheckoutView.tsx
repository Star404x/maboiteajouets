"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, CreditCard, Truck, User, ShoppingBag, Lock, ArrowLeft } from "lucide-react";
import { useCart, computeCart } from "@/lib/store/cart";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StripePaymentForm } from "./StripePaymentForm";

const STEPS = [
  { id: 1, label: "Coordonnées", Icon: User },
  { id: 2, label: "Livraison", Icon: Truck },
  { id: 3, label: "Paiement", Icon: CreditCard },
  { id: 4, label: "Confirmation", Icon: Check },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postal: string;
  city: string;
  country: string;
  shippingMethod: string;
}

export function CheckoutView() {
  const [step, setStep] = useState(1);
  // Стабильный orderId — генерируется один раз за сессию
  const [orderId] = useState(() => `MBAJ-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postal: "",
    city: "",
    country: "France",
    shippingMethod: "standard",
  });

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  const { lines, subtotal, shipping, total } = useMemo(
    () => computeCart(items),
    [items],
  );

  const handlePaymentSuccess = () => {
    clear();
    setStep(4);
  };

  const submit = () => {
    // Валидация на шаге 1
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Veuillez remplir tous les champs");
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      if (!formData.address || !formData.postal || !formData.city) {
        alert("Veuillez remplir l'adresse de livraison");
        return;
      }
      setStep(step + 1);
    } else if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      // Stripe form будет обработан внутри компонента StripePaymentForm
      // и вызовет handlePaymentSuccess
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
              {step === 1 && <StepContact formData={formData} setFormData={setFormData} />}
              {step === 2 && <StepShipping formData={formData} setFormData={setFormData} />}
              {step === 3 && (
                <StepPayment
                  total={total}
                  subtotal={subtotal}
                  shipping={shipping}
                  orderId={orderId}
                  formData={formData}
                  items={lines.map((l: any) => ({
                    id: l.product.id,
                    slug: l.product.slug,
                    name: l.product.name,
                    image: Array.isArray(l.product.images) ? l.product.images[0] : undefined,
                    price: l.product.price,
                    quantity: l.quantity,
                  }))}
                  onSuccess={handlePaymentSuccess}
                />
              )}
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
              {step < 3 && (
                <Button size="lg" onClick={submit}>
                  Continuer <ArrowRight className="w-4 h-4" />
                </Button>
              )}
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
                <span className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden", line.product.bgClass)}>
                  {typeof line.product.images[0] === 'string' && line.product.images[0].startsWith('/') ? (
                    <img
                      src={line.product.images[0]}
                      alt={line.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    line.product.images[0]
                  )}
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

function Field({
  label,
  value,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-1.5">{label}</label>
      <input
        {...props}
        value={value}
        onChange={onChange}
        className="w-full h-12 px-4 rounded-2xl border-2 border-navy/10 text-navy focus:outline-none focus:border-coral transition-colors"
      />
    </div>
  );
}

function StepContact({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-6">Vos coordonnées</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Prénom"
          placeholder="Sophie"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        />
        <Field
          label="Nom"
          placeholder="Martin"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Field
            label="Email"
            type="email"
            placeholder="sophie@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Téléphone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function StepShipping({
  formData,
  setFormData,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-6">Adresse de livraison</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="sm:col-span-2">
          <Field
            label="Adresse"
            placeholder="12 rue de la Paix"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <Field
          label="Code postal"
          placeholder="75002"
          value={formData.postal}
          onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
        />
        <Field
          label="Ville"
          placeholder="Paris"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Field
            label="Pays"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-display font-bold text-navy mb-3">Mode de livraison</h3>
        <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-coral bg-coral/5 cursor-pointer transition-colors">
          <input
            type="radio"
            name="shipping"
            checked={formData.shippingMethod === "standard"}
            onChange={(e) => setFormData({ ...formData, shippingMethod: "standard" })}
            className="accent-coral"
          />
          <div className="flex-1">
            <p className="font-semibold text-navy">Standard (48-72h)</p>
            <p className="text-xs text-navy/60 mt-0.5">Livraison en France métropolitaine</p>
          </div>
          <span className="font-bold text-mint text-sm">Gratuite</span>
        </label>
      </div>
    </div>
  );
}

function StepPayment({
  total,
  subtotal,
  shipping,
  orderId,
  formData,
  items,
  onSuccess,
}: {
  total: number;
  subtotal: number;
  shipping: number;
  orderId: string;
  formData: FormData;
  items: any[];
  onSuccess: () => void;
}) {
  return (
    <div>
      <h2 className="font-display font-bold text-navy text-2xl mb-2">Paiement sécurisé</h2>
      <p className="text-navy/60 text-sm mb-6 inline-flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" /> Vos données de carte ne sont pas stockées sur nos serveurs.
      </p>

      <StripePaymentForm
        amount={total}
        subtotal={subtotal}
        shipping={shipping}
        orderId={orderId}
        customerEmail={formData.email}
        customer={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }}
        address={{
          line1: formData.address,
          postalCode: formData.postal,
          city: formData.city,
          country: formData.country === "France" ? "FR" : formData.country,
        }}
        items={items}
        onSuccess={onSuccess}
      />
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
        Numéro de commande : <span className="font-bold text-navy">#MBAJ-{Date.now()}</span>
      </p>
      <Button asChild>
        <Link href="/boutique">Continuer les achats</Link>
      </Button>
    </div>
  );
}
