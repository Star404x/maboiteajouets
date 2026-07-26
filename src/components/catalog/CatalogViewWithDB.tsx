"use client";

import { useMemo, useState, useEffect } from "react";
import { PackageX } from "lucide-react";
import { PRODUCTS } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CatalogFilters, type Filters } from "./CatalogFilters";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types";

export function CatalogViewWithDB({
  initialCategory,
  initialAge,
}: {
  initialCategory?: string;
  initialAge?: string;
}) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    category: initialCategory,
    age: initialAge,
    priceMax: undefined,
    onlyPromo: false,
    sort: "recommended",
  });

  // Fetch fresh product data from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success && data.products) {
          // Convert DB results to Product type
          const dbProducts = data.products.map((p: any) => ({
            ...PRODUCTS.find(sp => sp.id === p.id) || {},
            id: p.id,
            price: parseFloat(p.price),
            reviewCount: p.reviewcount || 0,
          }));
          setProducts(dbProducts);
        }
      } catch (error) {
        console.warn("[CatalogViewWithDB] Failed to fetch from DB, using static data:", error);
        // Fall back to static data on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
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
  }, [products, filters]);

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
        <div className="hidden lg:block" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10">
      <CatalogFilters filters={filters} onChange={setFilters} total={filteredProducts.length} />

      <div>
        {filteredProducts.length === 0 ? (
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
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
