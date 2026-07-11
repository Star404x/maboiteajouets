"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "@/lib/data/products";
import type { Product } from "@/lib/types";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  favorites: string[];

  // actions
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  toggleFavorite: (productId: string) => void;

  // drawer
  openCart: () => void;
  closeCart: () => void;

  // derived
  getItemCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getLines: () => Array<CartLine & { product: Product }>;
  isFavorite: (productId: string) => boolean;
}

const FREE_SHIPPING_THRESHOLD = 49;
const STANDARD_SHIPPING = 4.9;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      favorites: [],

      addItem: (productId, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
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

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => {
          const p = PRODUCTS.find((pr) => pr.id === i.productId);
          return sum + (p?.price ?? 0) * i.quantity;
        }, 0),

      getShipping: () => {
        const sub = get().getSubtotal();
        if (sub === 0) return 0;
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
      },

      getTotal: () => get().getSubtotal() + get().getShipping(),

      getLines: () =>
        get()
          .items.map((i) => {
            const product = PRODUCTS.find((p) => p.id === i.productId);
            if (!product) return null;
            return { ...i, product };
          })
          .filter(Boolean) as Array<CartLine & { product: Product }>,

      isFavorite: (productId) => get().favorites.includes(productId),
    }),
    {
      name: "mbaj-cart",
      partialize: (state) => ({ items: state.items, favorites: state.favorites }),
    },
  ),
);

export const FREE_SHIPPING = FREE_SHIPPING_THRESHOLD;
