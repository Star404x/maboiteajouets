import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "S'inscrire sur Ma Boîte à Jouets",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Inscription" }]} />
      <PageHero eyebrow="Créer un compte" title="S'inscrire" accent="inscription" />

      <div className="max-w-md mx-auto">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
          <p className="font-semibold text-yellow-900 mb-4">
            🔴 NOT IMPLEMENTED
          </p>
          <p className="text-sm text-yellow-800">
            La fonctionnalité d'inscription n'est pas encore disponible.
          </p>
          <p className="text-xs text-yellow-700 mt-4">
            Avant le lancement, implémenter:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
            <li>Formulaire d'inscription (email, password, conditions)</li>
            <li>Email de vérification</li>
            <li>Validation des données RGPD</li>
            <li>Base de données utilisateurs</li>
            <li>Hash passwords (bcrypt/scrypt)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
