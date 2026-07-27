"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";

export function CategoryProductsClient({
  staticProducts,
}: {
  staticProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success && data.products) {
          // Merge DB data (price, reviewCount) with static product data
          const mergedProducts = staticProducts.map((staticProduct) => {
            const dbProduct = data.products.find((p: any) => p.id === staticProduct.id);
            if (dbProduct) {
              return {
                ...staticProduct,
                price: parseFloat(dbProduct.price),
                reviewCount: dbProduct.reviewcount || 0,
              };
            }
            return staticProduct;
          });
          setProducts(mergedProducts);
        }
      } catch (error) {
        console.warn("[CategoryProductsClient] Failed to fetch from DB, using static data:", error);
        // Fall back to static data on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [staticProducts]);

  if (loading) {
    return (
      <div className="grid gap-5 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
