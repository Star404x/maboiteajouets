"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Скролит страницу вверх при навигации
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Скролл вверх при изменении пути
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
