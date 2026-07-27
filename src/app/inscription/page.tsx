import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "S'inscrire sur Ma Boîte à Jouets",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container-wide py-8 lg:py-14 flex-1">
        <Breadcrumbs items={[{ label: "Inscription" }]} />
        <div className="max-w-md mx-auto py-12 lg:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-coral mb-3">
              Inscription
            </p>
            <h1 className="font-display font-bold text-navy text-3xl md:text-4xl mb-2">
              Créer un compte
            </h1>
            <p className="text-navy/70 text-sm">Rejoignez notre communauté</p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}
