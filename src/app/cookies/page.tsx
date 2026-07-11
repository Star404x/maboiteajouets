import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Politique de cookies",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Politique de cookies"
      breadcrumb="Cookies"
      sections={[
        {
          heading: "Qu'est-ce qu'un cookie ?",
          body: "Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site. Il permet notamment de mémoriser vos préférences et d'améliorer votre expérience.",
        },
        {
          heading: "Cookies essentiels",
          body:
            "Ces cookies sont indispensables au fonctionnement du site (panier, session, préférences). Ils ne nécessitent pas de consentement.",
        },
        {
          heading: "Cookies analytiques",
          body:
            "Avec votre accord, nous utilisons des cookies d'analyse pour comprendre comment vous utilisez le site et l'améliorer. Aucune donnée personnelle identifiable n'est utilisée.",
        },
        {
          heading: "Gestion de vos préférences",
          body:
            "Vous pouvez à tout moment modifier vos préférences via le bandeau cookies affiché lors de votre première visite, ou en effaçant les cookies depuis votre navigateur.",
        },
        {
          heading: "Retrait du consentement",
          body:
            "Le retrait du consentement peut se faire à tout moment sans que cela n'affecte le fonctionnement de base du site.",
        },
      ]}
    />
  );
}
