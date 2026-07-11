import type { Metadata } from "next";
import { getPromoProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Nos meilleures offres du moment sur les jouets premium.",
  alternates: { canonical: "/promotions" },
};

export default function PromoPage() {
  const products = getPromoProducts();
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Promotions" }]} />
      <PageHero
        eyebrow="Offres exclusives"
        title="En promotion"
        accent="promotion"
        description="Faites plaisir tout en économisant."
      />
      <ProductGrid products={products} />
    </div>
  );
}
