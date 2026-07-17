import type { Category } from "@/lib/types";

export const CATEGORIES: Category[] = [

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
    slug: "jeux-de-construction",
    name: "Jeux de Construction",
    description: "Construire, créer et imaginer sans limites",
    icon: "🧱",
    color: "amber",
    bgClass: "bg-[#FFF5E0]",
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
  {
    slug: "tapis-bebe",
    name: "Tapis bébé",
    description: "Tapis d'éveil et de jeu pour les tout-petits",
    icon: "🛏️",
    color: "amber",
    bgClass: "bg-[#FFF7E0]",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
