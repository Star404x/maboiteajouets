#!/usr/bin/env node
/**
 * Обновляет цены в products.ts
 * Использование: node scripts/update-prices.js <productId> <newPrice>
 * 
 * Пример: node scripts/update-prices.js p-009 39.99
 */

const fs = require('fs');
const path = require('path');

const productId = process.argv[2];
const newPrice = process.argv[3];

if (!productId || !newPrice) {
  console.error('❌ Usage: node scripts/update-prices.js <productId> <newPrice>');
  console.error('\nExamples:');
  console.error('  node scripts/update-prices.js p-009 39.99');
  console.error('  node scripts/update-prices.js p-015 8.99');
  process.exit(1);
}

const productsPath = path.join(__dirname, '../src/lib/data/products.ts');
let content = fs.readFileSync(productsPath, 'utf-8');

// Find the product and its price
const productRegex = new RegExp(
  `("id":\\s*"${productId}"[\\s\\S]*?"price":\\s*)([\\d.]+)`,
  'g'
);

const matches = [...content.matchAll(productRegex)];

if (matches.length === 0) {
  console.error(`❌ Product ${productId} not found in products.ts`);
  process.exit(1);
}

if (matches.length > 1) {
  console.error(`⚠️  Found ${matches.length} instances of ${productId}`);
}

const oldPrice = matches[0][2];

console.log(`📝 Updating price for ${productId}:`);
console.log(`  Old price: €${oldPrice}`);
console.log(`  New price: €${newPrice}`);

// Replace all occurrences
content = content.replace(productRegex, `$1${newPrice}`);

fs.writeFileSync(productsPath, content);

console.log(`✅ Price updated successfully!`);
console.log(`\n📦 Next steps:`);
console.log(`  1. npm run build`);
console.log(`  2. netlify deploy --prod`);
