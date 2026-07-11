import type { Metadata } from "next";
import Link from "next/link";
import { Package, Heart, MapPin, User } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Espace personnel Ma Boîte à Jouets",
  robots: { index: false, follow: false },
};

const LINKS = [
  { Icon: Package, label: "Mes commandes", href: "/compte/commandes", desc: "Suivez vos commandes" },
  { Icon: Heart, label: "Mes favoris", href: "/favoris", desc: "Retrouvez vos coups de cœur" },
  { Icon: MapPin, label: "Mes adresses", href: "/compte/adresses", desc: "Gérez vos adresses de livraison" },
  { Icon: User, label: "Mon profil", href: "/compte/profil", desc: "Modifier mes informations" },
];

export default function AccountPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Mon compte" }]} />
      <PageHero eyebrow="Bienvenue" title="Mon compte" accent="compte" />

      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-6 rounded-3xl bg-white shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all flex gap-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-coral/10 text-coral inline-flex items-center justify-center shrink-0">
                <link.Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy mb-1">{link.label}</h3>
                <p className="text-sm text-navy/60">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center p-8 rounded-3xl bg-cream-soft">
          <p className="text-navy/70 mb-4">Pas encore inscrit ?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild variant="secondary">
              <Link href="/connexion">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/inscription">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
