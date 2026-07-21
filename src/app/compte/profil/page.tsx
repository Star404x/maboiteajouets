import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Modifiez vos informations personnelles",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Mon compte", href: "/compte" }, { label: "Mon profil" }]} />
      <PageHero eyebrow="Mon compte" title="Mon profil" accent="profil" />

      <div className="max-w-3xl mx-auto">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
          <p className="font-semibold text-yellow-900 mb-4">
            🔴 NOT IMPLEMENTED
          </p>
          <p className="text-sm text-yellow-800">
            L'édition du profil n'est pas encore disponible.
          </p>
          <p className="text-xs text-yellow-700 mt-4">
            À implémenter:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
            <li>Édition du nom et prénom</li>
            <li>Édition de l'email</li>
            <li>Changement du mot de passe</li>
            <li>Newsletter opt-in/out</li>
            <li>Suppression du compte (RGPD)</li>
            <li>Téléchargement des données (RGPD)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
