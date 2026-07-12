import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data/products";
import { CATEGORIES } from "@/lib/data/categories";

export const dynamic = "force-static";

const BASE = "https://maboiteajouets.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    "",
    "/boutique",
    "/nouveautes",
    "/promotions",
    "/meilleures-ventes",
    "/a-propos",
    "/contact",
    "/faq",
    "/livraison",
    "/mentions-legales",
    "/cgv",
    "/confidentialite",
    "/cookies",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const categories = CATEGORIES.map((c) => ({
    url: `${BASE}/categorie/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const products = PRODUCTS.map((p) => ({
    url: `${BASE}/produit/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categories, ...products];
}
