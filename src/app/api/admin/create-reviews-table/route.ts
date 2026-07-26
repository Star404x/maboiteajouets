import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

function verifyAdminKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`;
  return authHeader === expectedKey;
}

let pool: Pool | null = null;

function getPool() {
  if (pool) return pool;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL not set');
  pool = new Pool({ connectionString: dbUrl, max: 2 });
  return pool;
}

export async function POST(request: NextRequest) {
  if (!verifyAdminKey(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbPool = getPool();
    const client = await dbPool.connect();

    // Create reviews table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        author VARCHAR NOT NULL,
        rating INT NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        avatarColor VARCHAR,
        verified_purchase BOOLEAN DEFAULT false,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create index
    await client.query(`CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews(productId)`);

    // Insert sample data
    const reviews = [
      ['r-001', 'p-009', 'Marie D.', 5, 'Excellent qualité!', '2026-07-20', 'pink'],
      ['r-002', 'p-009', 'Jean P.', 4, 'Très bon produit', '2026-07-19', 'blue'],
      ['r-003', 'p-015', 'Sophie L.', 5, 'Adorable!', '2026-07-18', 'green'],
      ['r-004', 'p-017', 'Luc M.', 4, 'Bon produit', '2026-07-17', 'yellow'],
    ];

    for (const [id, productId, author, rating, content, date, color] of reviews) {
      await client.query(
        `INSERT INTO reviews (id, productId, author, rating, content, date, avatarColor) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
        [id, productId, author, rating, content, date, color]
      );
    }

    client.release();

    return NextResponse.json({
      success: true,
      message: "Reviews table created and populated"
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      success: false
    }, { status: 500 });
  }
}
