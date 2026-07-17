"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS } from "@/lib/data/products";
import type { Product } from "@/lib/types";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartState {
  // persisted
  items: CartLine[];
  favorites: string[];

  // transient
  isOpen: boolean;

  // actions
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  toggleFavorite: (productId: string) => void;

  // drawer
  openCart: () => void;
  closeCart: () => void;
}

export const FREE_SHIPPING = 0; // Доставка всегда бесплатна
export const STANDARD_SHIPPING = 0;

/**
 * Selectors return only primitive/raw slices of state.
 * Derived values (lines, subtotal, total) live in `useCartDerived()`
 * to avoid infinite render loops (React error #185).
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],
      isOpen: false,

      addItem: (productId, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { productId, quantity }] });
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        });
      },

      clear: () => set({ items: [] }),

      toggleFavorite: (productId) => {
        const favs = get().favorites;
        if (favs.includes(productId)) {
          set({ favorites: favs.filter((id) => id !== productId) });
        } else {
          set({ favorites: [...favs, productId] });
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "mbaj-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        favorites: state.favorites,
      }),
      skipHydration: true, // manual hydration via useCartHydration below
    },
  ),
);

/**
 * Compute the derived cart data (product-joined lines + totals).
 * Called by components with useMemo to keep referential stability.
 */
export function computeCart(items: CartLine[]) {
  const lines = items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.id === i.productId);
      return product ? { ...i, product } : null;
    })
    .filter(Boolean) as Array<CartLine & { product: Product }>;

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0,
  );
  const shipping = 0; // Доставка бесплатна
  const total = subtotal + shipping;
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);

  return { lines, subtotal, shipping, total, itemCount };
}
