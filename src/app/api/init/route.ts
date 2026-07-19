import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Try to load pg dynamically to avoid build-time issues
    const pg = await import("pg");
    const { Pool } = pg;

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL not configured" },
        { status: 500 }
      );
    }

    console.log("[INIT] Connecting to database...");
    const pool = new Pool({ connectionString: dbUrl, max: 5 });
    const client = await pool.connect();

    console.log("[INIT] ✅ Connected!");

    // Create products table
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
    console.log("[INIT] ✅ Products table created");

    // Check existing products
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
          "Boîte d'activités 5 faces avec engrenages, boules, blocs, labyrinthe et miroir",
          36.4,
          4.8,
          245,
          true,
          "{'/products/boite-activites-hape-1.png'}",
          "Populaire",
        ],
        [
          "p-015",
          "O-Ball - Ballon sensoriel multicolore",
          "balle-prehension-multicolore",
          "jouets-bebe",
          "Jouets bébé",
          "Ballon avec trous pour une bonne prise",
          7.8,
          4.7,
          180,
          true,
          "{'/products/balle-prehension-1.png'}",
          null,
        ],
        [
          "p-017",
          "Cube sensoriel Ludi",
          "cube-sensoriel-ludi",
          "jouets-bebe",
          "Jouets bébé",
          "Cube avec 6 activités différentes",
          13.9,
          4.8,
          92,
          true,
          "{'/products/cube-sensoriel-ludi-1.png'}",
          "Nouveau",
        ],
      ];

      for (const p of products) {
        await client.query(
          `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, reviewCount, inStock, images, badge)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          p
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
      message: "Database initialized successfully",
      productsCount: Math.max(count, 3),
    });
  } catch (error: any) {
    console.error("[INIT] ❌ Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
