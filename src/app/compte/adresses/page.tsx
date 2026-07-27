/**
 * /compte/adresses - Manage shipping addresses
 */

import { Metadata } from "next";
import { ProtectedRoute } from "@/components/account/ProtectedRoute";
import { AddressManager } from "@/components/account/AddressManager";

export const metadata: Metadata = {
  title: "Mes Adresses",
  description: "Gérer vos adresses de livraison",
};

export default function AdressesPage() {
  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display font-bold text-navy text-3xl mb-8">Mes Adresses</h1>
          <AddressManager />
        </div>
      </div>
    </ProtectedRoute>
  );
}
