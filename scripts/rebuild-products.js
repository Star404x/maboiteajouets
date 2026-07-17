#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// IDs товаров которые нужно оставить
const keepIds = new Set([
  'p-009', 'p-015', 'p-016', 'p-017', 'p-018', 'p-019', 'p-020', 'p-021',
  'p-022', 'p-023', 'p-024', 'p-025', 'p-026', 'p-027', 'p-028', 'p-029',
  'p-030', 'p-031', 'p-032', 'p-033', 'p-034'
]);

const filePath = path.join(__dirname, '../src/lib/data/products.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Split на отдельные товары
const productPattern = /(\s*\{\s*id:\s*"p-\d{3}"[\s\S]*?\n\s*\},?)/g;
const matches = content.match(productPattern) || [];

// Фильтруем товары
const keptProducts = matches.filter(match => {
  const idMatch = match.match(/id:\s*"(p-\d{3})"/);
  return idMatch && keepIds.has(idMatch[1]);
});

console.log(`✅ Оставлено товаров: ${keptProducts.length}`);
keptProducts.forEach(m => {
  const idMatch = m.match(/id:\s*"(p-\d{3})"/);
  console.log(`   ${idMatch[1]}`);
});

// Найди индекс где начинается массив товаров
const arrayStart = content.indexOf('export const PRODUCTS: Product[] = [');
const firstProduct = content.indexOf('  {', arrayStart);
const arrayEnd = content.lastIndexOf('];');

// Возьми конец файла (helpers functions)
const helpers = content.substring(arrayEnd);

// Собери новый файл
const newContent =
  content.substring(0, firstProduct) +
  keptProducts.join('\n  ') +
  '\n' +
  helpers;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('\n✅ Файл перестроен');
