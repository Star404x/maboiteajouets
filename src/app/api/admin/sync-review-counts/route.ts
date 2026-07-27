/**
 * POST /api/admin/sync-review-counts
 * Synchronize product reviewCount based on reviews table
 */

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;

  let DB_URL = process.env.DATABASE_URL;

  if (!DB_URL) {
    const pgHost = process.env.PGHOST;
    const pgPort = process.env.PGPORT || "5432";
    const pgUser = process.env.PGUSER;
    const pgPassword = process.env.PGPASSWORD;
    const pgDatabase = process.env.PGDATABASE || "railway";

    if (pgHost && pgUser && pgPassword) {
      DB_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    }
  }

  if (!DB_URL) {
    throw new Error("DATABASE_URL not set");
  }

  pool = new Pool({
    connectionString: DB_URL,
    max: 2,
  });

  return pool;
}

export async function POST(request: NextRequest) {
  try {
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
      console.log("[SYNC-REVIEWS] Starting review count sync...");

      // For each product, count its reviews and update reviewCount
      const productsResult = await client.query(
        "SELECT DISTINCT id FROM products ORDER BY id"
      );

      let updated = 0;

      for (const product of productsResult.rows) {
        const reviewCountResult = await client.query(
          "SELECT COUNT(*) as count FROM reviews WHERE productId = $1",
          [product.id]
        );

        const count = parseInt(reviewCountResult.rows[0].count || 0);

        // Update the product with correct reviewCount
        await client.query(
          "UPDATE products SET reviewCount = $1 WHERE id = $2",
          [count, product.id]
        );

        updated++;
        if (updated % 5 === 0) {
          console.log(`[SYNC-REVIEWS] Updated ${updated}/${productsResult.rows.length} products`);
        }
      }

      console.log(`[SYNC-REVIEWS] ✅ Synced ${updated} products`);

      return NextResponse.json({
        success: true,
        message: `Successfully synced review counts for ${updated} products`,
        updated,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[SYNC-REVIEWS] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to sync review counts" },
      { status: 500 }
    );
  }
}
