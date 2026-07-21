#!/usr/bin/env node

/**
 * Migrate reviews from src/lib/data/reviews.ts to PostgreSQL
 * Run with: node scripts/migrate-reviews-to-db.js
 * Requires: DATABASE_URL environment variable
 */

const { Pool } = require("pg");
const { REVIEWS } = require("../src/lib/data/reviews.ts");

async function migrateReviews() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("❌ DATABASE_URL not set");
      process.exit(1);
    }

    console.log("[MIGRATE] Connecting to database...");
    const pool = new Pool({
      connectionString: dbUrl,
      max: 5,
    });

    const client = await pool.connect();
    console.log("✅ Connected to database");

    // Check current reviews count
    const existingResult = await client.query("SELECT COUNT(*) as count FROM reviews");
    const existingCount = parseInt(existingResult.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`[INFO] Database already has ${existingCount} reviews. Skipping migration.`);
      console.log("[INFO] To clear and re-migrate: DELETE FROM reviews; then run again");
      client.release();
      await pool.end();
      process.exit(0);
    }

    console.log("[MIGRATE] Starting review import...");

    // Group reviews by product
    const reviewsByProduct = {};
    REVIEWS.forEach((review) => {
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

    let totalInserted = 0;

    // Insert reviews for each product
    for (const [productId, reviews] of Object.entries(reviewsByProduct)) {
      for (const review of reviews) {
        try {
          await client.query(
            `INSERT INTO reviews (id, productId, author, rating, content, date, avatarColor, verified_purchase)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [
              review.id,
              productId,
              review.author,
              review.rating,
              review.content,
              review.date,
              review.avatarColor || null,
              true, // Mark as verified (they came from our system)
            ]
          );
          totalInserted++;
        } catch (err) {
          console.error(`⚠️ Error inserting review ${review.id}:`, err.message);
        }
      }
    }

    console.log(`✅ Inserted ${totalInserted} reviews`);

    // Show stats by product
    console.log("\n[STATS] Reviews by product:");
    for (const [productId, reviews] of Object.entries(reviewsByProduct)) {
      console.log(`  ${productId}: ${reviews.length} reviews`);
    }

    client.release();
    await pool.end();

    console.log("\n✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

migrateReviews();
