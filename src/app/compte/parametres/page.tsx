/**
 * /compte/parametres - Account settings
 */

import { Metadata } from "next";
import { ProtectedRoute } from "@/components/account/ProtectedRoute";

export const metadata: Metadata = {
  title: "Paramètres",
  description: "Paramètres de compte",
};

export default function ParametresPage() {
  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-navy text-3xl mb-8">Paramètres de Compte</h1>

          <div className="space-y-8">
            {/* Mot de passe */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-navy mb-4">Changer le mot de passe</h2>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90">
                  Mettre à jour
                </button>
              </div>
            </div>

            {/* Préférences */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-navy mb-4">Préférences</h2>
              <label className="flex items-center gap-3 mb-4">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm">Recevoir les offres spéciales par email</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm">Recevoir les mises à jour de mes commandes</span>
              </label>
            </div>

            {/* Zone Danger */}
            <div className="border border-red-200 bg-red-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg text-red-600 mb-4">Zone Danger</h2>
              <p className="text-sm text-red-600 mb-4">
                Supprimer votre compte est une action irréversible. Toutes vos données seront supprimées.
              </p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
