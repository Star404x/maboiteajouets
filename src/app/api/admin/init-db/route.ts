import { NextRequest, NextResponse } from "next/server";

// Verify admin API key
function verifyAdminKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  const expectedKey = `Bearer ${process.env.ADMIN_API_KEY}`;
  return authHeader === expectedKey;
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
    const { Pool } = await import("pg");
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL not configured" },
        { status: 500 }
      );
    }

    console.log("[INIT] Connecting to database...");
    const pool = new Pool({ connectionString: dbUrl, max: 2 });
    const client = await pool.connect();

    console.log("[INIT] ✅ Connected");

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name VARCHAR NOT NULL,
        slug VARCHAR UNIQUE NOT NULL,
        category VARCHAR NOT NULL,
        categoryName VARCHAR,
        description TEXT,
        price DECIMAL NOT NULL,
        oldPrice DECIMAL,
        rating DECIMAL DEFAULT 4.5,
        reviewCount INT DEFAULT 0,
        inStock BOOLEAN DEFAULT true,
        images TEXT[],
        materials TEXT[],
        safety TEXT[],
        badge VARCHAR,
        bgClass VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Check existing data
    const result = await client.query("SELECT COUNT(*) as count FROM products");
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log("[INIT] Loading sample products...");
      const products = [
        [
          "p-009",
          "Boîte d'activités Hape",
          "boite-activites-hape",
          "jouets-bebe",
          "Jouets bébé",
          "Boîte d'activités 5 faces avec engrenages, boules, blocs, labyrinthe et miroir pour éveiller la motricité.",
          36.4,
          4.8,
          245,
        ],
        [
          "p-015",
          "O-Ball - Ballon sensoriel multicolore",
          "balle-prehension-multicolore",
          "jouets-bebe",
          "Jouets bébé",
          "Ballon avec trous pour une bonne prise en main - stimule les sens et la motricité fine.",
          7.8,
          4.7,
          180,
        ],
        [
          "p-017",
          "Cube sensoriel Ludi",
          "cube-sensoriel-ludi",
          "jouets-bebe",
          "Jouets bébé",
          "Cube avec 6 activités différentes pour éveiller bébé - sons, textures, couleurs.",
          13.9,
          4.8,
          92,
        ],
        [
          "p-021",
          "Actiroller - Rouleau Musical Miniland",
          "actiroller-rouleau-musical",
          "jouets-bebe",
          "Jouets bébé",
          "Rouleau musical qui roule et produit des sons mélodieux.",
          32.8,
          4.7,
          78,
        ],
      ];

      for (const p of products) {
        const [id, name, slug, category, categoryName, description, price, rating, reviewCount] = p as any[];
        await client.query(
          `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, reviewCount, inStock, images)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10)
           ON CONFLICT DO NOTHING`,
          [
            id,
            name,
            slug,
            category,
            categoryName,
            description,
            price,
            rating,
            reviewCount,
            [`/products/${slug}-1.png`],
          ]
        );
      }

      console.log(`[INIT] ✅ Loaded ${products.length} products`);
    } else {
      console.log(`[INIT] ℹ️  Database already has ${count} products`);
    }

    client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Database initialized",
      productsCount: Math.max(count, 4),
    });
  } catch (error: any) {
    console.error("[INIT] ❌ Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
