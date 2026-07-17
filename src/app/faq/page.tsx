import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { FaqList } from "@/components/faq/FaqList";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Réponses aux questions fréquentes sur Ma Boîte à Jouets",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    q: "Combien de temps prend la livraison ?",
    a: "Nous livrons partout en France en 48 à 72h ouvrées. Livraison gratuite dès 49 € d'achat.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Oui, vous disposez de 14 jours après réception pour retourner un produit qui ne vous convient pas. Retour gratuit et remboursement sous 5 jours.",
  },
  {
    q: "Vos jouets sont-ils sécurisés ?",
    a: "Absolument. Tous nos jouets sont certifiés CE et respectent les normes européennes de sécurité (EN71). Nous privilégions les matériaux naturels et non-toxiques.",
  },
  {
    q: "Proposez-vous des emballages cadeaux ?",
    a: "Oui ! L'emballage cadeau est offert sur toutes les commandes. Il suffit de le préciser au moment du checkout.",
  },
  {
    q: "Quels moyens de paiement acceptez-vous ?",
    a: "Nous acceptons Carte Bancaire, Apple Pay, PayPal et Google Pay. Tous les paiements sont sécurisés par cryptage SSL.",
  },
  {
    q: "Puis-je modifier ma commande après validation ?",
    a: "Contactez-nous dans les 2h suivant votre commande à info.maboiteajouets@gmail.com. Au-delà, la commande est en préparation.",
  },
  {
    q: "Livrez-vous à l'international ?",
    a: "Pour l'instant, nous livrons uniquement en France métropolitaine, en Corse et à Monaco. D'autres pays européens arrivent bientôt !",
  },
  {
    q: "Comment vous contacter ?",
    a: "Email : info.maboiteajouets@gmail.com | Téléphone : 0785301551 | Formulaire de contact sur notre site. Nous répondons sous 24h ouvrées.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "FAQ" }]} />
      <PageHero
        eyebrow="Foire aux questions"
        title="On répond à vos questions"
        accent="questions"
      />

      <div className="max-w-3xl mx-auto">
        <FaqList items={FAQS} />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </div>
    </div>
  );
}
