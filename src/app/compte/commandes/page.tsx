/**
 * /compte/commandes - User's order history
 */

import { Metadata } from "next";
import { ProtectedRoute } from "@/components/account/ProtectedRoute";
import { OrderHistory } from "@/components/account/OrderHistory";

export const metadata: Metadata = {
  title: "Mes Commandes",
  description: "Historique de vos commandes",
};

export default function CommandesPage() {
  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <h1 className="font-display font-bold text-navy text-3xl mb-8">Mes Commandes</h1>
        <OrderHistory />
      </div>
    </ProtectedRoute>
  );
}
