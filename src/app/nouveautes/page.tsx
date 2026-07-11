import type { Metadata } from "next";
import { getNewProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Nouveautés",
  description: "Découvrez les dernières arrivées dans notre boutique.",
  alternates: { canonical: "/nouveautes" },
};

export default function NewProductsPage() {
  const products = getNewProducts();
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Nouveautés" }]} />
      <PageHero
        eyebrow="Fraîchement arrivés"
        title="Nos nouveautés"
        accent="nouveautés"
        description="Les jouets qui font l'actualité chez Ma Boîte à Jouets."
      />
      <ProductGrid products={products} />
    </div>
  );
}
