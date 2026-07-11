import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    slug: "peluches",
    name: "Peluches",
    description: "Doudous tout doux pour câlins et rêves",
    icon: "🧸",
    color: "coral",
    bgClass: "bg-pinkwash",
  },
  {
    slug: "jouets-educatifs",
    name: "Jouets éducatifs",
    description: "Apprendre en jouant, dès le plus jeune âge",
    icon: "🧩",
    color: "sky",
    bgClass: "bg-skywash",
  },
  {
    slug: "vehicules",
    name: "Véhicules",
    description: "Voitures, trains, avions et grandes aventures",
    icon: "🚗",
    color: "sunflower",
    bgClass: "bg-[#FFF7E0]",
  },
  {
    slug: "jeux-de-societe",
    name: "Jeux de société",
    description: "Des moments en famille inoubliables",
    icon: "🎲",
    color: "grape",
    bgClass: "bg-[#F3EDFA]",
  },
  {
    slug: "jouets-bebe",
    name: "Jouets bébé",
    description: "Tout doux pour les tout-petits",
    icon: "👶",
    color: "mint",
    bgClass: "bg-[#E4F7F5]",
  },
  {
    slug: "jeux-exterieur",
    name: "Jeux d'extérieur",
    description: "Bouger, courir, s'amuser dehors",
    icon: "🏃",
    color: "leaf",
    bgClass: "bg-[#EFF7DE]",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
