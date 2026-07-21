import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Politique de retours",
  description: "Retours et échanges - Ma Boîte à Jouets",
};

export default function ReturnsPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Retours" }]} />
      <PageHero eyebrow="Aide et retours" title="Politique de retours" accent="retours" />

      <div className="max-w-3xl mx-auto prose prose-sm prose-navy">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200 mb-8">
          <p className="font-semibold text-yellow-900">
            🔴 AUDIT REQUIRED: Cette page n'a pas encore de contenu validé juridiquement.
          </p>
          <p className="text-sm text-yellow-800 mt-2">
            Avant la publication, le propriétaire doit fournir:
          </p>
          <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
            <li>Délai de rétractation (jour de début, jours de durée)</li>
            <li>Conditions de retour (état du produit, emballage)</li>
            <li>Adresse de retour</li>
            <li>Qui paie la livraison retour</li>
            <li>Délai de remboursement</li>
            <li>Formulaire type de rétractation</li>
            <li>Exceptions (jeux ouverts, produits hygiéniques, etc.)</li>
          </ul>
        </div>

        <h2>Droit de rétractation</h2>
        <p>À remplir avec les conditions réelles du magasin.</p>

        <h2>Procédure de retour</h2>
        <p>À implémenter après consultation juridique.</p>
      </div>
    </div>
  );
}
