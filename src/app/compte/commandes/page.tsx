import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Mes commandes",
  description: "Historique de vos commandes",
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Mon compte", href: "/compte" }, { label: "Mes commandes" }]} />
      <PageHero eyebrow="Mon compte" title="Mes commandes" accent="commandes" />

      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
          <p className="font-semibold text-yellow-900 mb-4">
            🔴 NOT IMPLEMENTED
          </p>
          <p className="text-sm text-yellow-800">
            L'historique des commandes n'est pas encore disponible.
          </p>
          <p className="text-xs text-yellow-700 mt-4">
            À implémenter:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
            <li>Récupération des commandes par utilisateur authentifié</li>
            <li>Affichage du numéro de commande, date, montant</li>
            <li>Lien vers le détail de la commande</li>
            <li>Suivi du colis (tracking)</li>
            <li>Option pour annuler ou retourner</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
