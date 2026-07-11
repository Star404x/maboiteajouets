import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/confidentialite" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      breadcrumb="Confidentialité"
      sections={[
        {
          heading: "Responsable du traitement",
          body: "Ma Boîte à Jouets est responsable du traitement des données collectées sur maboiteajouets.fr.",
        },
        {
          heading: "Données collectées",
          body: [
            "Lors d'une commande : nom, prénom, adresse email, adresse postale, numéro de téléphone.",
            "Lors de la navigation : cookies techniques (essentiels au fonctionnement du site) et, avec votre accord, cookies d'analyse et de mesure d'audience.",
            "Aucune donnée bancaire n'est conservée sur nos serveurs.",
          ],
        },
        {
          heading: "Finalités",
          body: [
            "Traitement de vos commandes et livraisons.",
            "Communication commerciale (uniquement avec votre accord explicite).",
            "Amélioration du site et de nos services.",
            "Respect de nos obligations légales et fiscales.",
          ],
        },
        {
          heading: "Vos droits (RGPD)",
          body:
            "Vous disposez d'un droit d'accès, de rectification, de suppression, d'opposition, de limitation et de portabilité de vos données. Pour exercer ces droits : bonjour@maboiteajouets.fr.",
        },
        {
          heading: "Durée de conservation",
          body:
            "Les données de commande sont conservées 10 ans (obligation comptable). Les données marketing sont conservées 3 ans après le dernier contact.",
        },
        {
          heading: "Sécurité",
          body:
            "Toutes les données sont transmises en HTTPS. L'accès aux données est strictement limité aux personnes autorisées.",
        },
      ]}
    />
  );
}
