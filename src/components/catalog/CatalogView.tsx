"use client";

import { useMemo, useState } from "react";
import { PackageX } from "lucide-react";
import { PRODUCTS } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogFilters, type Filters } from "./CatalogFilters";
import { Button } from "@/components/ui/Button";

export function CatalogView({
  initialCategory,
  initialAge,
}: {
  initialCategory?: string;
  initialAge?: string;
}) {
  const [filters, setFilters] = useState<Filters>({
    category: initialCategory,
    age: initialAge,
    priceMax: undefined,
    onlyPromo: false,
    sort: "recommended",
  });

  const products = useMemo(() => {
    let list = [...PRODUCTS];
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.age) list = list.filter((p) => p.age.includes(filters.age as never));
    if (filters.priceMax) list = list.filter((p) => p.price <= filters.priceMax!);
    if (filters.onlyPromo) list = list.filter((p) => p.oldPrice && p.oldPrice > p.price);

    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      // recommended = insertion order
    }

    return list;
  }, [filters]);

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
      <CatalogFilters filters={filters} onChange={setFilters} total={products.length} />

      <div>
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-cream-soft mx-auto mb-4 inline-flex items-center justify-center">
              <PackageX className="w-8 h-8 text-navy/30" />
            </div>
            <h3 className="font-display font-bold text-navy text-xl mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-navy/60 mb-6 max-w-md mx-auto">
              Essayez d'ajuster vos filtres ou parcourez toutes nos catégories.
            </p>
            <Button
              variant="secondary"
              onClick={() =>
                setFilters({
                  category: undefined,
                  age: undefined,
                  priceMax: undefined,
                  onlyPromo: false,
                  sort: "recommended",
                })
              }
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
