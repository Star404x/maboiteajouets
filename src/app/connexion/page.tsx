import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Se connecter à votre compte - Ma Boîte à Jouets",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Connexion" }]} />
      <PageHero eyebrow="Authentification" title="Se connecter" accent="connexion" />

      <div className="max-w-md mx-auto">
        <div className="p-8 rounded-3xl bg-yellow-50 border-2 border-yellow-200">
          <p className="font-semibold text-yellow-900 mb-4">
            🔴 NOT IMPLEMENTED
          </p>
          <p className="text-sm text-yellow-800">
            La fonctionnalité de connexion n'est pas encore disponible.
          </p>
          <p className="text-xs text-yellow-700 mt-4">
            Avant le lancement, implémenter:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 list-disc list-inside">
            <li>Authentification email/password</li>
            <li>Verification email</li>
            <li>Intégration Stripe pour vérification de compte</li>
            <li>2FA (recommandé)</li>
            <li>Rate limiting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
