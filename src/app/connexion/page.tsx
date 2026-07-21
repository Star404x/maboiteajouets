import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { LoginForm } from "@/components/auth/LoginForm";

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

      <LoginForm />
    </div>
  );
}
