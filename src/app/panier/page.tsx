import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Votre panier chez Ma Boîte à Jouets",
  alternates: { canonical: "/panier" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
