"use client";

import { useSearchParams } from "next/navigation";
import { CatalogView } from "./CatalogView";

/**
 * Extract query params on the client (compatible with static export).
 */
export function CatalogParams() {
  const params = useSearchParams();
  return (
    <CatalogView
      initialCategory={params.get("category") ?? undefined}
      initialAge={params.get("age") ?? undefined}
    />
  );
}
