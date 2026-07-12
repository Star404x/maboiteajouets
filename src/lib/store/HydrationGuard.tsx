"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart";

/**
 * Manual hydration to prevent Zustand persist SSR/CSR mismatches.
 * Renders children immediately; store rehydration happens once after mount.
 * All persisted-driven UI should call `useIsHydrated()` and render neutral
 * defaults until true.
 */
export function HydrationGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return <>{children}</>;
}

export function useIsHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useCart.persist.onFinishHydration(() => setHydrated(true));
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);
  return hydrated;
}
