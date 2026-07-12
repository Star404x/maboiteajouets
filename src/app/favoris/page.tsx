"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useIsHydrated } from "@/lib/store/HydrationGuard";
import { PRODUCTS } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export default function FavoritesPage() {
  const favorites = useCart((s) => s.favorites);
  const hydrated = useIsHydrated();
  const products = useMemo(
    () => (hydrated ? PRODUCTS.filter((p) => favorites.includes(p.id)) : []),
    [favorites, hydrated],
  );

  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Mes favoris" }]} />
      <PageHero
        eyebrow="Vos coups de cœur"
        title="Mes favoris"
        accent="favoris"
      />

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 rounded-full bg-cream-soft mx-auto mb-4 inline-flex items-center justify-center">
            <Heart className="w-10 h-10 text-navy/30" />
          </div>
          <h2 className="font-display font-bold text-navy text-2xl mb-3">
            Aucun favori pour le moment
          </h2>
          <p className="text-navy/60 mb-6 max-w-md mx-auto">
            Cliquez sur le cœur des produits que vous aimez pour les retrouver ici.
          </p>
          <Button asChild>
            <Link href="/boutique">Explorer la boutique</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
