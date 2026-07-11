import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  alternates: { canonical: "/cgv" },
};

export default function CgvPage() {
  return (
    <LegalPage
      title="Conditions générales de vente"
      breadcrumb="CGV"
      sections={[
        {
          heading: "1. Objet",
          body: "Les présentes CGV régissent les ventes réalisées sur maboiteajouets.fr entre Ma Boîte à Jouets et tout client majeur résidant en France.",
        },
        {
          heading: "2. Produits",
          body: "Les produits présentés sur le site sont vendus dans la limite des stocks disponibles. Les photos et descriptions sont les plus fidèles possibles, mais n'engagent pas de manière contractuelle.",
        },
        {
          heading: "3. Prix",
          body: "Les prix sont indiqués en euros TTC. Ma Boîte à Jouets se réserve le droit de modifier ses prix à tout moment, les produits étant facturés au prix en vigueur au moment de la commande.",
        },
        {
          heading: "4. Commande & paiement",
          body: "Le paiement s'effectue par carte bancaire, Apple Pay ou PayPal. La commande est validée après confirmation du paiement. Les données bancaires ne sont pas conservées sur nos serveurs.",
        },
        {
          heading: "5. Livraison",
          body: "Livraison en France métropolitaine en 48 à 72h ouvrées. Gratuite dès 49 € d'achat. Ma Boîte à Jouets ne saurait être tenue responsable des retards imputables au transporteur.",
        },
        {
          heading: "6. Droit de rétractation",
          body: "Le client dispose de 14 jours à compter de la réception pour retourner un produit. Le remboursement est effectué sous 14 jours après réception du retour.",
        },
        {
          heading: "7. Garanties",
          body: "Tous nos produits bénéficient de la garantie légale de conformité (2 ans) et de la garantie des vices cachés.",
        },
        {
          heading: "8. Litiges",
          body: "En cas de litige, le droit français est applicable. Une solution amiable sera recherchée avant tout recours judiciaire. Le client peut recourir gratuitement à une médiation.",
        },
      ]}
    />
  );
}
