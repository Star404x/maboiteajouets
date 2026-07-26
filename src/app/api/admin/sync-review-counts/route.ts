import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Verify admin API key
function verifyAdminKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`;
  return authHeader === expectedKey;
}

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL not set');
  }
  pool = new Pool({ connectionString: dbUrl, max: 2 });
  return pool;
}

export async function POST(request: NextRequest) {
  // Check admin key
  if (!verifyAdminKey(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - invalid or missing ADMIN_API_KEY' },
      { status: 401 }
    );
  }

  try {
    console.log("[SYNC] Starting review count sync...");
    const dbPool = getPool();
    const client = await dbPool.connect();

    try {
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

      // Reset reviewCount to 0 for products with no reviews
      const zeroReviews = await client.query(`
        UPDATE products 
        SET reviewCount = 0 
        WHERE id NOT IN (SELECT DISTINCT productId FROM reviews)
      `);

      console.log(`[SYNC] ✅ Reset ${zeroReviews.rowCount} products with no reviews`);

      // Get final result
      const final = await client.query(`
        SELECT id, name, reviewCount 
        FROM products 
        ORDER BY reviewCount DESC
      `);

      return NextResponse.json({
        success: true,
        message: "Review counts synced successfully",
        productsUpdated: reviewCounts.rows.length + (zeroReviews.rowCount || 0),
        products: final.rows
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error("[SYNC] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
