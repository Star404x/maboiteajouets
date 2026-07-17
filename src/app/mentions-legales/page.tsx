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
            "Ma Boîte à Jouets",
            "Siège social : Paris, France",
            "SIRET : 89158238900021",
            "Date de création : 28/03/2025",
            "Email : info.maboiteajouets@gmail.com",
            "Téléphone : 0785301551",
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
