import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { BestSellersClient } from "@/components/catalog/BestSellersClient";

export const metadata: Metadata = {
  title: "Meilleures ventes",
  description: "Les jouets les plus aimés par nos clients.",
  alternates: { canonical: "/meilleures-ventes" },
};

export default function BestSellersPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Meilleures ventes" }]} />
      <PageHero
        eyebrow="Choisis par les familles"
        title="Meilleures ventes"
        accent="ventes"
        description="Les incontournables qui font le bonheur des enfants."
      />
      <BestSellersClient />
    </div>
  );
}
