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
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Inscription" }]} />
      <PageHero eyebrow="Créer un compte" title="S'inscrire" accent="inscription" />

      <SignupForm />
    </div>
  );
}
