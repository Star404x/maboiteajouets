/**
 * BestSellersClient - Fetch best sellers from API with ratings
 */

"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getBestSellers } from "@/lib/data/products";

export function BestSellersClient() {
  const [products, setProducts] = useState<Product[]>(getBestSellers() as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductsWithRatings() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const allProducts: any[] = data.products || [];

        // Filter best sellers from static list
        const bestSellerIds = new Set(getBestSellers().map((p) => p.id));
        const bestSellersFromDB = allProducts.filter((p: any) => bestSellerIds.has(p.id));

        // Merge: use DB data (for ratings, price), fallback to static
        const merged: Product[] = getBestSellers().map((staticProduct) => {
          const dbProduct = bestSellersFromDB.find((p: any) => p.id === staticProduct.id);
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
        console.error("[BestSellersClient] Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsWithRatings();
  }, []);

  return <ProductGrid products={products} />;
}
