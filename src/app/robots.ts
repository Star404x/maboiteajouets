import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panier", "/commande", "/compte", "/favoris", "/api/"],
      },
    ],
    sitemap: "https://maboiteajouets.fr/sitemap.xml",
    host: "https://maboiteajouets.fr",
  };
}
