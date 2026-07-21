#!/usr/bin/env node

/**
 * Parse reviews from TypeScript file and generate SQL insert statements
 * This creates a migration script to load reviews into PostgreSQL
 * 
 * Usage: node scripts/migrate-reviews-sql.js > migrations/load-reviews.sql
 */

const fs = require("fs");
const path = require("path");

const reviewsFile = path.join(__dirname, "../src/lib/data/reviews.ts");

try {
  const content = fs.readFileSync(reviewsFile, "utf8");

  // Extract JSON array from TypeScript export
  // Pattern: export const REVIEWS: Review[] = [...]
  const match = content.match(/export const REVIEWS: Review\[\] = (\[[\s\S]*?\]);/);

  if (!match) {
    console.error("❌ Could not find REVIEWS export in reviews.ts");
    process.exit(1);
  }

  const jsonStr = match[1];
  const reviews = eval(jsonStr); // Parse the array

  console.log("-- Migration: Load reviews into PostgreSQL");
  console.log("-- Generated from src/lib/data/reviews.ts");
  console.log("-- Usage: psql $DATABASE_URL < migrations/load-reviews.sql");
  console.log("");

  console.log("BEGIN TRANSACTION;");
  console.log("");

  // Group reviews by product
  const reviewsByProduct = {};
  reviews.forEach((review) => {
    // Extract product ID from review ID (format: r-{productId}-{number})
    const match = review.id.match(/r-(\d+)-/);
    const productId = match ? `p-${match[1]}` : null;

    if (productId) {
      if (!reviewsByProduct[productId]) {
        reviewsByProduct[productId] = [];
      }
      reviewsByProduct[productId].push(review);
    }
  });

  let insertCount = 0;

  // Generate INSERT statements
  for (const [productId, productReviews] of Object.entries(reviewsByProduct)) {
    for (const review of productReviews) {
      const id = review.id.replace(/'/g, "''");
      const author = review.author.replace(/'/g, "''");
      const content = review.content.replace(/'/g, "''");
      const date = review.date;
      const avatarColor = (review.avatarColor || "").replace(/'/g, "''");

      console.log(`INSERT INTO reviews (id, productId, author, rating, content, date, avatarColor, verified_purchase) VALUES`);
      console.log(`  ('${id}', '${productId}', '${author}', ${review.rating}, '${content}', '${date}', '${avatarColor}', true)`);
      console.log(`  ON CONFLICT (id) DO NOTHING;`);

      insertCount++;
    }
  }

  console.log("");
  console.log("COMMIT;");
  console.log("");
  console.log(`-- Total reviews to insert: ${insertCount}`);
  console.log(`-- Products: ${Object.keys(reviewsByProduct).length}`);

} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
