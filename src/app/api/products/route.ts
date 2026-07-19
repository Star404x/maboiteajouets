import { NextResponse } from "next/server";
import { Pool } from "pg";

// Use DATABASE_URL from environment (Railway, Netlify, etc)
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({
  connectionString: DB_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    console.log("[API] GET /api/products - fetching from PostgreSQL");
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT id, slug, name, price, category, categoryName, description, rating, reviewCount, inStock, images, badge FROM products ORDER BY id"
      );
      console.log(`[API] ✅ Fetched ${result.rows.length} products`);
      
      return NextResponse.json({
        success: true,
        products: result.rows,
        timestamp: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[API] ❌ Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
