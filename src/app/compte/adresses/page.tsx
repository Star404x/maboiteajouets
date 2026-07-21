import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Mes adresses",
  description: "Gérez vos adresses de livraison",
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Mon compte", href: "/compte" }, { label: "Mes adresses" }]} />
      <PageHero eyebrow="Mon compte" title="Mes adresses" accent="adresses" />

      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
          <p className="font-semibold text-yellow-900 mb-4">
            🔴 NOT IMPLEMENTED
          </p>
          <p className="text-sm text-yellow-800">
            La gestion des adresses n'est pas encore disponible.
          </p>
          <p className="text-xs text-yellow-700 mt-4">
            À implémenter:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
            <li>Formulaire d'ajout d'adresse (validation postale)</li>
            <li>Édition d'adresse existante</li>
            <li>Suppression d'adresse</li>
            <li>Adresse par défaut pour livraison/facturation</li>
            <li>Validation format France/UE</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
