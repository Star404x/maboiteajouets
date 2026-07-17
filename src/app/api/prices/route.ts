import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const dbUrl = process.env.DATABASE_URL;
console.log("[API Route] DATABASE_URL available:", !!dbUrl ? "✅ YES" : "❌ NO");

const pool = new Pool({
  connectionString: dbUrl,
});

export async function GET(request: NextRequest) {
  try {
    console.log("[GET /api/prices] Connecting to DB...");
    const client = await pool.connect();
    const result = await client.query("SELECT id, name, price FROM products ORDER BY id");
    client.release();

    return NextResponse.json({
      success: true,
      prices: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[GET /api/prices] ❌ Error:", error.message);
    console.error("[GET /api/prices] Error details:", JSON.stringify({
      code: error.code,
      address: error.address,
      port: error.port,
    }));
    return NextResponse.json(
      { success: false, error: error.message, debug: { code: error.code, addr: error.address } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const adminKey = process.env.ADMIN_API_KEY || "default-insecure-key";

  if (apiKey !== adminKey) {
    console.warn("[POST /api/prices] Unauthorized request");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
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
    const result = await client.query(
      "UPDATE products SET price = $1 WHERE id = $2 RETURNING id, name, price",
      [price, id]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    console.log(`[POST /api/prices] ✅ Updated ${id} to €${price}`);

    return NextResponse.json({
      success: true,
      product: result.rows[0],
      message: `Price updated for ${result.rows[0].name}`,
    });
  } catch (error: any) {
    console.error("[POST /api/prices] Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
