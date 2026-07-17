"use client";

import { usePriceSync } from "@/hooks/usePriceSync";

/**
 * Provider component that syncs prices periodically
 * Wrap this around your app content
 */
export function PriceSyncProvider({ children }: { children: React.ReactNode }) {
  // Sync prices every 60 seconds
  usePriceSync(60000);

  return <>{children}</>;
}
