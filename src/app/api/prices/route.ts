import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Production database URL
const PROD_DB_URL = "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";
const dbUrl = process.env.DATABASE_URL || PROD_DB_URL;

console.log("[API Route] DATABASE_URL source:", process.env.DATABASE_URL ? "env var" : "hardcoded");
console.log("[API Route] DB Host:", dbUrl.split('@')[1]?.split('/')[0] || 'unknown');

const pool = new Pool({
  connectionString: dbUrl,
});

export async function GET(request: NextRequest) {
  try {
    console.log("[GET /api/prices] Attempt 1: Testing pool connection...");
    const client = await pool.connect();
    const result = await client.query("SELECT id, name, price FROM products ORDER BY id");
    client.release();
    console.log(`[GET /api/prices] ✅ Success: ${result.rows.length} products`);

    return NextResponse.json({
      success: true,
      prices: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[GET /api/prices] ❌ Connection Error:", error.code || error.message);
    console.error("[GET /api/prices] Host:", error.address || 'unknown');
    console.error("[GET /api/prices] Port:", error.port || 'unknown');
    console.error("[GET /api/prices] DB_URL from env:", !!process.env.DATABASE_URL);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("[POST /api/prices] Received request");
  const apiKey = request.headers.get("x-api-key");
  const adminKey = process.env.ADMIN_API_KEY || "admin123";
  console.log("[POST /api/prices] API Key check:", apiKey === adminKey ? "✅ PASS" : "❌ FAIL");

  if (apiKey !== adminKey) {
    console.warn("[POST /api/prices] Unauthorized request");
    return NextResponse.json(
      { success: false, error: "Unauthorized", received: apiKey ? apiKey.substring(0, 5) + '...' : 'none' },
      { status: 401 }
    );
  }

  try {
    const { id, price } = await request.json();

    if (!id || typeof price !== "number" || price < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid id or price" },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    console.log("[POST /api/prices] Updating product", id, "to price", price);
    const result = await client.query(
      "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
      [price, id]
    );
    client.release();
    console.log("[POST /api/prices] Update successful:", result.rowCount, "rows updated");

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.info(`[POST /api/prices] ✅ Updated ${id} to €${price}`);

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      message: `Price updated for ${result.rows[0].name}`,
    });
  } catch (error: any) {
    console.error("[POST /api/prices] ❌ Error:", error.message, { code: error.code });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
