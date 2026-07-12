import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { CatalogParams } from "@/components/catalog/CatalogParams";

export const metadata: Metadata = {
  title: "Boutique — Tous nos jouets",
  description:
    "Découvrez toute notre sélection de jouets premium pour enfants de 0 à 12 ans. Peluches, jouets éducatifs, véhicules, jeux de société et plus.",
  alternates: { canonical: "/boutique" },
};

export default function BoutiquePage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Boutique" }]} />
      <PageHero
        eyebrow="Notre catalogue"
        title="Toute la boutique"
        accent="boutique"
        description="Une sélection premium de jouets d'éveil, sensoriels et éducatifs."
      />
      <Suspense fallback={<CatalogView />}>
        <CatalogParams />
      </Suspense>
    </div>
  );
}
