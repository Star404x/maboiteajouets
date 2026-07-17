"use client";

import { useEffect, useRef } from "react";

interface PriceUpdate {
  id: string;
  name: string;
  price: number;
}

/**
 * Hook to sync prices from database periodically
 * Updates local PRODUCTS cache when prices change
 */
export function usePriceSync(interval: number = 60000) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPricesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    // Initial sync
    syncPrices();

    // Set up periodic sync (default every 60 seconds)
    intervalRef.current = setInterval(syncPrices, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval]);

  async function syncPrices() {
    try {
      const res = await fetch("/.netlify/functions/prices");
      if (!res.ok) return;

      const data = await res.json();
      if (!data.success || !data.prices) return;

      // Store prices in sessionStorage for access across components
      const priceMap: Record<string, number> = {};
      data.prices.forEach((p: PriceUpdate) => {
        priceMap[p.id] = p.price;
      });

      sessionStorage.setItem("__prices_sync", JSON.stringify({
        timestamp: Date.now(),
        prices: priceMap,
      }));

      console.log("[usePriceSync] Synced prices at", new Date().toISOString());
    } catch (error) {
      console.warn("[usePriceSync] Sync failed:", error);
    }
  }

  // Manual trigger function
  return { syncPrices };
}

/**
 * Get current price for a product (sync'd from DB if available)
 */
export function getPriceFromSync(productId: string, fallbackPrice: number): number {
  try {
    const sync = sessionStorage.getItem("__prices_sync");
    if (!sync) return fallbackPrice;

    const data = JSON.parse(sync);
    const price = data.prices[productId];
    return price !== undefined ? price : fallbackPrice;
  } catch {
    return fallbackPrice;
  }
}
