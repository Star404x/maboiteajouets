/**
 * Shared domain types.
 * Kept backend-agnostic so we can plug Shopify / Woo / Medusa later.
 */

export type Badge = "Nouveau" | "Promo" | "Meilleure vente" | "Coup de cœur";

export type AgeRange = "0-12m" | "1-3" | "3-5" | "6-8" | "9+";

export type CategorySlug =
  | "peluches"
  | "jouets-educatifs"
  | "vehicules"
  | "jeux-de-societe"
  | "jouets-bebe"
  | "jeux-exterieur";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string; // emoji placeholder — replace with 3D render
  color: string; // tailwind class prefix for accent
  bgClass: string; // pastel bg tailwind classes
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatarColor?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  categoryName: string;
  description: string;
  longDescription?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  age: AgeRange[];
  images: string[]; // emoji placeholders — see PLACEHOLDER_IMAGES.md
  badge?: Badge;
  inStock: boolean;
  stockCount?: number;
  materials?: string[];
  dimensions?: string;
  safety?: string[];
  color: string; // main accent color for card background
  bgClass: string; // pastel bg for the image area
}

export interface CartItem {
  productId: string;
  quantity: number;
}
