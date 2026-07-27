/**
 * /compte/favoris - User's wishlist
 */

import { Metadata } from "next";
import { ProtectedRoute } from "@/components/account/ProtectedRoute";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = {
  title: "Mes Favoris",
  description: "Ma liste de souhaits",
};

export default function FavorisPage() {
  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <h1 className="font-display font-bold text-navy text-3xl mb-8">Mes Favoris</h1>
        <WishlistView />
      </div>
    </ProtectedRoute>
  );
}
