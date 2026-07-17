#!/usr/bin/env node
/**
 * Встраивает подсчет отзывов в products.ts
 * Гарантирует что reviewCount будет правильным при build-time
 */

const fs = require('fs');
const path = require('path');

// Read reviews data
const reviewsPath = path.join(__dirname, '../src/lib/data/reviews.ts');
const reviewsContent = fs.readFileSync(reviewsPath, 'utf-8');

// Parse review IDs: extract all r-XXX- patterns
const reviewCounts = {};
const matches = reviewsContent.match(/id:\s*"r-(\d+)-/g);
if (matches) {
  matches.forEach(match => {
    const productNum = match.match(/r-(\d+)-/)[1];
    reviewCounts[productNum] = (reviewCounts[productNum] || 0) + 1;
  });
}

console.log('📊 Review counts:', reviewCounts);

// Read products data
const productsPath = path.join(__dirname, '../src/lib/data/products.ts');
let productsContent = fs.readFileSync(productsPath, 'utf-8');

// Replace reviewCount in each product
Object.entries(reviewCounts).forEach(([productNum, count]) => {
  const productId = `p-${productNum}`;
  
  // Find pattern: "id": "p-XXX"......"reviewCount": <number>
  const pattern = new RegExp(
    `("id":\\s*"${productId}"[^}]*?"reviewCount":\\s*)\\d+`,
    'g'
  );
  
  productsContent = productsContent.replace(pattern, `$1${count}`);
});

// Remove the enrichment function if it exists (since we're doing it statically now)
productsContent = productsContent.replace(
  /\/\/ Enrich products with actual review counts[\s\S]*?export const PRODUCTS: Product\[\] = enrichProductsWithReviews\(PRODUCTS_BASE\);/,
  'export const PRODUCTS = PRODUCTS_BASE;'
);

// Write back
fs.writeFileSync(productsPath, productsContent);

console.log('✅ Embedded review counts into products.ts');
console.log('   Total products updated:', Object.keys(reviewCounts).length);
Object.entries(reviewCounts).forEach(([num, count]) => {
  console.log(`   p-${num}: ${count} reviews`);
});
