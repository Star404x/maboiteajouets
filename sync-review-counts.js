#!/usr/bin/env node

const { Pool } = require("pg");

async function syncReviewCounts() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("❌ DATABASE_URL not set");
      process.exit(1);
    }

    console.log("[SYNC] Connecting to database...");
    const pool = new Pool({ connectionString: dbUrl, max: 2 });
    const client = await pool.connect();

    console.log("[SYNC] Fetching review counts by product...");
    
    // Get count of reviews per product
    const reviewCounts = await client.query(`
      SELECT productId, COUNT(*) as count
      FROM reviews
      GROUP BY productId
    `);

    console.log(`[SYNC] Found reviews for ${reviewCounts.rows.length} products`);

    // Update each product's reviewCount
    for (const row of reviewCounts.rows) {
      await client.query(
        "UPDATE products SET reviewCount = $1 WHERE id = $2",
        [row.count, row.productId]
      );
      console.log(`[SYNC] ✅ ${row.productId}: ${row.count} reviews`);
    }

    // Also reset reviewCount to 0 for products with no reviews
    const zeroReviews = await client.query(`
      UPDATE products 
      SET reviewCount = 0 
      WHERE id NOT IN (SELECT DISTINCT productId FROM reviews)
    `);

    console.log(`[SYNC] ✅ Reset ${zeroReviews.rowCount} products with no reviews`);

    // Show final result
    const final = await client.query(`
      SELECT id, name, reviewCount 
      FROM products 
      ORDER BY reviewCount DESC
    `);

    console.log("\n[RESULT] Final review counts:");
    final.rows.forEach(p => {
      console.log(`  ${p.id}: ${p.name} → ${p.reviewCount} reviews`);
    });

    client.release();
    pool.end();
    console.log("\n✅ Sync complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

syncReviewCounts();
