import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { PromoClient } from "@/components/catalog/PromoClient";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Nos meilleures offres du moment sur les jouets premium.",
  alternates: { canonical: "/promotions" },
};

export default function PromoPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Promotions" }]} />
      <PageHero
        eyebrow="Offres exclusives"
        title="En promotion"
        accent="promotion"
        description="Faites plaisir tout en économisant."
      />
      <PromoClient />
    </div>
  );
}
