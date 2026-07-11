import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Commande",
  description: "Finalisez votre commande en toute sécurité",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg mb-10 text-center">
        Finaliser la <span className="text-coral">commande</span>
      </h1>
      <CheckoutView />
    </div>
  );
}
