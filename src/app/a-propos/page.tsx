import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Sparkles, Leaf, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez l'histoire de Ma Boîte à Jouets, la boutique française de jouets premium pour enfants.",
  alternates: { canonical: "/a-propos" },
};

const VALUES = [
  { Icon: Heart, title: "Passion", desc: "Chaque jouet est choisi avec amour, comme pour nos propres enfants." },
  { Icon: Leaf, title: "Éco-responsable", desc: "Matériaux durables, emballages recyclés, moins de plastique." },
  { Icon: Shield, title: "Sécurité", desc: "Tous nos produits sont certifiés CE et testés rigoureusement." },
  { Icon: Sparkles, title: "Magie", desc: "Le sourire des enfants est notre plus belle récompense." },
];

export default function AboutPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "À propos" }]} />

      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2 text-center">
          Notre histoire
        </p>
        <h1 className="font-display font-bold text-navy text-display-md md:text-display-xl text-center text-balance mb-6">
          Une boîte pleine de <span className="text-coral">bonheur</span>
        </h1>
        <p className="text-lg text-navy/70 text-center text-balance leading-relaxed">
          Ma Boîte à Jouets, c'est l'histoire d'une famille qui a voulu offrir aux enfants ce qu'il y a
          de mieux. Des jouets pensés pour éveiller, apprendre, rassurer et faire grandir.
        </p>
      </div>

      {/* Story visual */}
      <div className="max-w-4xl mx-auto mt-14 mb-20 relative aspect-[16/9] rounded-4xl bg-gradient-hero flex items-center justify-center overflow-hidden">
        <div className="text-[10rem]">🧸</div>
        <div className="absolute top-8 left-8 text-6xl">🐰</div>
        <div className="absolute bottom-8 right-8 text-6xl">🚂</div>
        <div className="absolute top-8 right-16 text-4xl">⭐</div>
        <div className="absolute bottom-16 left-16 text-4xl">✨</div>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-20">
        {VALUES.map((v) => (
          <div key={v.title} className="p-6 rounded-3xl bg-white shadow-soft text-center">
            <div className="w-12 h-12 rounded-2xl bg-coral/10 inline-flex items-center justify-center mb-4">
              <v.Icon className="w-6 h-6 text-coral" />
            </div>
            <h3 className="font-display font-bold text-navy mb-2">{v.title}</h3>
            <p className="text-sm text-navy/70 leading-snug">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Numbers */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { value: "10 000+", label: "Familles ravies" },
          { value: "500+", label: "Jouets sélectionnés" },
          { value: "48h", label: "Livraison en France" },
          { value: "4.9/5", label: "Note moyenne" },
        ].map((n) => (
          <div key={n.label} className="text-center">
            <p className="font-display font-bold text-coral text-4xl md:text-5xl">
              {n.value}
            </p>
            <p className="text-navy/60 text-sm mt-1">{n.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto text-center rounded-4xl bg-pinkwash p-10 lg:p-14">
        <h2 className="font-display font-bold text-navy text-display-md text-balance mb-4">
          Prêts pour l'aventure ?
        </h2>
        <p className="text-navy/70 mb-6">
          Découvrez notre collection et faites plaisir aux enfants qui vous entourent.
        </p>
        <Button asChild size="lg">
          <Link href="/boutique">Découvrir la boutique</Link>
        </Button>
      </div>
    </div>
  );
}
