import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

// Create pool lazily on first request (Railway env vars not available at build time)
let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;
  
  // Try DATABASE_URL first
  let DB_URL = process.env.DATABASE_URL;
  
  // If not set, try to construct from individual Railway variables (PGHOST, PGUSER, etc)
  if (!DB_URL) {
    const pgHost = process.env.PGHOST;
    const pgPort = process.env.PGPORT || '5432';
    const pgUser = process.env.PGUSER;
    const pgPassword = process.env.PGPASSWORD;
    const pgDatabase = process.env.PGDATABASE || 'railway';
    
    if (pgHost && pgUser && pgPassword) {
      DB_URL = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;
    }
  }
  
  if (!DB_URL) {
    throw new Error('DATABASE_URL not set and could not construct from PGHOST/PGUSER/PGPASSWORD');
  }
  
  pool = new Pool({
    connectionString: DB_URL,
    max: 10,
  });
  
  return pool;
}

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

    const dbPool = getPool();
    const client = await dbPool.connect();
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
