"use client";

import { useSearchParams } from "next/navigation";
import { CatalogViewWithDB } from "./CatalogViewWithDB";

/**
 * Extract query params on the client and fetch fresh product data from DB.
 */
export function CatalogParams() {
  const params = useSearchParams();
  return (
    <CatalogViewWithDB
      initialCategory={params.get("category") ?? undefined}
      initialAge={params.get("age") ?? undefined}
    />
  );
}
