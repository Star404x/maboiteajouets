import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);
  return (
    <section className="container-wide py-16 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
            La sélection
          </p>
          <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
            Nos produits <span className="text-coral">coups de cœur</span>
          </h2>
          <p className="mt-3 text-navy/70 max-w-xl">
            Nos jouets préférés du moment, choisis avec soin par notre équipe.
          </p>
        </div>
        <Button asChild variant="secondary" className="self-start md:self-auto">
          <Link href="/boutique">
            Tout voir <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
