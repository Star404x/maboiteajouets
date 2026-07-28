import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin endpoint to add database indexes for performance
 * Requires ADMIN_API_KEY
 * 
 * POST /api/admin/add-indexes
 */

function getPool() {
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

  return new Pool({ connectionString: DB_URL, max: 1 });
}

export async function POST(request: NextRequest) {
  // Verify admin key
  const authHeader = request.headers.get("Authorization");
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`;

  if (!authHeader || authHeader !== expectedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const pool = getPool();
  const client = await pool.connect();

  const indexes = [
    // Products indexes
    "CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)",
    "CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)",
    "CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)",

    // Users indexes
    "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
    "CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)",

    // Orders indexes
    "CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)",
    "CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)",

    // Reviews indexes
    "CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)",
    "CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)",

    // Wishlists indexes
    "CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id)",

    // User addresses indexes
    "CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(is_default) WHERE is_default = true",

    // User activity indexes
    "CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action)",
    "CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC)",
  ];

  const results: { name: string; status: string }[] = [];

  try {
    for (const indexSql of indexes) {
      try {
        await client.query(indexSql);
        const indexName = indexSql.match(/idx_\w+/)?.[0] || "unknown";
        results.push({ name: indexName, status: "created" });
        console.log(`✅ Created index: ${indexName}`);
      } catch (err: any) {
        const indexName = indexSql.match(/idx_\w+/)?.[0] || "unknown";
        if (err.message.includes("already exists")) {
          results.push({ name: indexName, status: "already_exists" });
          console.log(`⚠️ Already exists: ${indexName}`);
        } else {
          results.push({ name: indexName, status: "error", });
          console.error(`❌ Error creating ${indexName}:`, err.message);
        }
      }
    }

    // Count indexes by table
    const summary = await client.query(`
      SELECT 
        tablename,
        COUNT(*) as index_count
      FROM pg_indexes
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename
    `);

    return NextResponse.json(
      {
        success: true,
        message: "Indexes created successfully",
        results,
        summary: summary.rows,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[INDEXES] Error:", err);
    return NextResponse.json(
      { error: "Failed to create indexes", details: err.message },
      { status: 500 }
    );
  } finally {
    client.release();
    pool.end();
  }
}
