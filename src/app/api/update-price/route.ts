import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const DB_URL = "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require";

const pool = new Pool({
  connectionString: DB_URL,
  max: 10,
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, newPrice } = body;

    if (!productId || newPrice === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing productId or newPrice" },
        { status: 400 }
      );
    }

    console.log(`[API] UPDATE: ${productId} → €${newPrice}`);

    const client = await pool.connect();
    try {
      const result = await client.query(
        "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
        [newPrice, productId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        );
      }

      console.log(`[API] ✅ Updated:`, result.rows[0]);

      return NextResponse.json({
        success: true,
        product: result.rows[0],
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
