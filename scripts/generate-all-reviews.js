#!/usr/bin/env node
/**
 * Генерирует отзывы для ВСЕХ товаров в products.ts
 * Гарантирует от 4 до 20 отзывов на каждый товар
 */

const fs = require('fs');
const path = require('path');

// Sample review templates
const reviewTemplates = [
  {
    author: "Marie C.",
    rating: 5,
    content: "Excellente qualité ! Mon enfant l'adore. Très satisfait de cet achat."
  },
  {
    author: "Jean M.",
    rating: 5,
    content: "Livraison rapide, produit conforme. Très recommandé !"
  },
  {
    author: "Sophie L.",
    rating: 4,
    content: "Très bon produit, robuste et intéressant. Peut-être un peu cher, mais la qualité justifie le prix."
  },
  {
    author: "Thomas D.",
    rating: 5,
    content: "Parfait ! Aucune arête tranchante, tout est lisse. Mon fils adore."
  },
  {
    author: "Carole V.",
    rating: 5,
    content: "Cadeau génial ! Elle a adoré. Joli design, couleurs naturelles. Beau packaging aussi."
  },
  {
    author: "Pierre B.",
    rating: 4,
    content: "Bon produit. Très stimulant pour le développement. Seulement, un petit bruit, mais rien de grave."
  },
  {
    author: "Isabelle R.",
    rating: 5,
    content: "Excellent investissement ! Durable et éducatif. Utilise tous les sens de l'enfant."
  },
  {
    author: "Luc F.",
    rating: 5,
    content: "Notre enfant adore. Occupation garantie ! Qualité toujours au rendez-vous."
  },
  {
    author: "Anne-Marie T.",
    rating: 4,
    content: "Parfait pour une chambre Montessori. Bonne taille, pas trop lourd. Excellent rapport qualité-prix."
  },
  {
    author: "Maxime G.",
    rating: 5,
    content: "Acheté après lecture des avis positifs. Confirme tout ! Très satisfait."
  },
  {
    author: "Laurence K.",
    rating: 5,
    content: "Enfin un produit vraiment bien ! Chaque élément sollicite une compétence différente."
  },
  {
    author: "François N.",
    rating: 4,
    content: "Bon achat. Mon enfant l'utilise tous les jours. Construction robuste."
  },
  {
    author: "Valérie S.",
    rating: 5,
    content: "Meilleur choix ! Testé avec plusieurs enfants. Tous l'ont adoré."
  },
  {
    author: "Henri M.",
    rating: 5,
    content: "Investissement sage. Mon bébé apprend en jouant. Sûr et ludique à la fois."
  },
  {
    author: "Nicole P.",
    rating: 5,
    content: "Cadeau parfait ! Bébé s'amuse et apprend. Matériaux naturels, pas de plastique."
  },
  {
    author: "Sarah J.",
    rating: 5,
    content: "Petit prix, grand effet ! Mon bébé l'adore. Facile à tenir."
  },
  {
    author: "Marc H.",
    rating: 5,
    content: "Classique indispensable. Tous les bébés devraient en avoir un."
  },
  {
    author: "Chloé D.",
    rating: 4,
    content: "Bien mais simple. Pas révolutionnaire, mais efficace et bon marché."
  },
  {
    author: "David L.",
    rating: 5,
    content: "Excellent pour les déplacements. Tient dans le sac. Nos enfants l'ont tous eu."
  },
  {
    author: "Emma V.",
    rating: 5,
    content: "Joli design, couleurs vives. Bébé joue avec depuis longtemps. Légère et sûre."
  }
];

const colors = [
  "bg-pink-100", "bg-blue-100", "bg-yellow-100", "bg-green-100", "bg-purple-100",
  "bg-orange-100", "bg-red-100", "bg-pink-200", "bg-blue-200", "bg-green-200",
  "bg-indigo-100", "bg-cyan-100", "bg-pink-300", "bg-purple-200", "bg-yellow-200",
  "bg-orange-200", "bg-red-200", "bg-green-300"
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// Read products.ts to get all product IDs
const productsPath = path.join(__dirname, '../src/lib/data/products.ts');
const productsContent = fs.readFileSync(productsPath, 'utf-8');

// Extract all product IDs
const productIds = [];
const idMatches = productsContent.match(/"id":\s*"(p-\d+)"/g);
if (idMatches) {
  idMatches.forEach(match => {
    const id = match.match(/"(p-\d+)"/)[1];
    if (!productIds.includes(id)) {
      productIds.push(id);
    }
  });
}

console.log(`Found ${productIds.length} products:`, productIds.join(', '));

// Generate reviews for all products
const allReviews = [];
let reviewId = 1;

productIds.forEach((productId, productIndex) => {
  const productNum = productId.replace('p-', '');
  
  // Random count between 4 and 20
  const reviewCount = getRandomInt(4, 20);
  console.log(`Generating ${reviewCount} reviews for ${productId}...`);
  
  // Shuffle templates and pick random ones
  const shuffled = shuffleArray(reviewTemplates);
  
  for (let i = 0; i < reviewCount; i++) {
    const template = shuffled[i % shuffled.length];
    const colorIndex = (reviewId - 1) % colors.length;
    
    allReviews.push({
      id: `r-${productNum}-${String(i + 1).padStart(3, '0')}`,
      author: template.author,
      rating: template.rating,
      date: getDateDaysAgo(getRandomInt(5, 180)),
      content: template.content,
      avatarColor: colors[colorIndex]
    });
    
    reviewId++;
  }
});

// Generate TypeScript file
const tsCode = `import type { Review } from "@/lib/types";

/**
 * Отзывы клиентов — все товары
 * Разброс: 4-20 отзывов на товар для реалистичности.
 * АВТОМАТИЧЕСКИ СГЕНЕРИРОВАНО scripts/generate-all-reviews.js
 */
export const REVIEWS: Review[] = [
${allReviews.map(r => `  {
    id: "${r.id}",
    author: "${r.author}",
    rating: ${r.rating},
    date: "${r.date}",
    content: "${r.content}",
    avatarColor: "${r.avatarColor}",
  },`).join('\n')}
];
`;

const reviewsPath = path.join(__dirname, '../src/lib/data/reviews.ts');
fs.writeFileSync(reviewsPath, tsCode);

console.log(`\n✅ Generated ${allReviews.length} reviews for ${productIds.length} products`);
console.log(`   Saved to: ${reviewsPath}`);

// Summary
const counts = {};
allReviews.forEach(r => {
  const productNum = r.id.split('-')[1];
  counts[productNum] = (counts[productNum] || 0) + 1;
});

console.log('\n📊 Review counts per product:');
Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([product, count]) => {
  console.log(`   p-${product}: ${count} reviews`);
});
