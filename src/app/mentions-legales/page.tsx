import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      title="Mentions légales"
      breadcrumb="Mentions légales"
      sections={[
        {
          heading: "Éditeur du site",
          body: [
            "Ma Boîte à Jouets — SAS au capital de 10 000 €",
            "Siège social : Paris, France",
            "SIRET : à compléter",
            "Numéro TVA intracommunautaire : à compléter",
            "Directeur de publication : à compléter",
            "Contact : bonjour@maboiteajouets.fr",
          ],
        },
        {
          heading: "Hébergement",
          body: "Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.",
        },
        {
          heading: "Propriété intellectuelle",
          body:
            "L'ensemble du contenu de ce site (textes, images, éléments graphiques, logos, marques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
        },
        {
          heading: "Responsabilité",
          body:
            "Ma Boîte à Jouets s'efforce de fournir des informations aussi précises que possible. Toutefois, elle ne saurait être tenue responsable des erreurs, omissions ou indisponibilités des services.",
        },
      ]}
    />
  );
}
