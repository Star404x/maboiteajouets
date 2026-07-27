/**
 * PromoClient - Fetch promo products from API with ratings
 */

"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getPromoProducts } from "@/lib/data/products";

export function PromoClient() {
  const [products, setProducts] = useState<Product[]>(getPromoProducts() as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductsWithRatings() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const allProducts: any[] = data.products || [];

        // Filter promo products from static list
        const promoIds = new Set(getPromoProducts().map((p) => p.id));
        const promoFromDB = allProducts.filter((p: any) => promoIds.has(p.id));

        // Merge: use DB data (for ratings, price), fallback to static
        const merged: Product[] = getPromoProducts().map((staticProduct) => {
          const dbProduct = promoFromDB.find((p: any) => p.id === staticProduct.id);
          if (dbProduct) {
            return {
              ...staticProduct,
              price: parseFloat(dbProduct.price),
              rating: dbProduct.rating || staticProduct.rating,
              reviewCount: dbProduct.reviewcount || 0,
            } as Product;
          }
          return staticProduct as Product;
        });

        setProducts(merged);
      } catch (error) {
        console.error("[PromoClient] Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsWithRatings();
  }, []);

  return <ProductGrid products={products} />;
}
