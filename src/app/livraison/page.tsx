import type { Metadata } from "next";
import { Truck, RotateCcw, Package, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Informations sur la livraison, les délais et les retours chez Ma Boîte à Jouets.",
  alternates: { canonical: "/livraison" },
};

export default function ShippingPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Livraison" }]} />
      <PageHero
        eyebrow="Livraison & retours"
        title="Livraison rapide et sûre"
        accent="rapide"
      />

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-14">
        {[
          {
            Icon: Truck,
            title: "Livraison standard",
            desc: "48-72h ouvrées partout en France métropolitaine. Gratuite dès 49 €.",
            color: "coral",
          },
          {
            Icon: Package,
            title: "Livraison express",
            desc: "24h ouvrées avec suivi en temps réel. Supplément de 6,90 €.",
            color: "sunflower",
          },
          {
            Icon: MapPin,
            title: "Point relais",
            desc: "Plus de 12 000 points partout en France. Frais de 3,90 €.",
            color: "mint",
          },
          {
            Icon: RotateCcw,
            title: "Retours gratuits",
            desc: "14 jours pour changer d'avis. Retour gratuit et remboursement sous 5 jours.",
            color: "grape",
          },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-3xl bg-white shadow-soft flex gap-4">
            <div className={`h-12 w-12 rounded-2xl bg-${item.color}/10 text-${item.color} inline-flex items-center justify-center shrink-0`}>
              <item.Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-navy mb-1">{item.title}</h3>
              <p className="text-navy/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <section>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">Comment ça marche ?</h2>
          <ol className="space-y-3">
            {[
              "Passez votre commande sur le site et payez en toute sécurité.",
              "Nous préparons votre colis avec soin, souvent le jour même.",
              "Le transporteur récupère votre commande sous 24h.",
              "Livraison en 48-72h ouvrées à votre domicile ou en point relais.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="w-8 h-8 rounded-full bg-coral text-white font-bold text-sm inline-flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <span className="text-navy/80 pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">Suivi de commande</h2>
          <p className="text-navy/80">
            Vous recevrez un email de confirmation avec un lien de suivi dès l'expédition de votre commande.
            Vous pouvez également suivre vos commandes depuis votre espace client.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">Emballage</h2>
          <p className="text-navy/80">
            Tous nos colis sont emballés dans des cartons recyclés et recyclables, sans plastique inutile.
            L'emballage cadeau est offert&nbsp;: précisez-le lors de votre commande.
          </p>
        </section>
      </div>
    </div>
  );
}
