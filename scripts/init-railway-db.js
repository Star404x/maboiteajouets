#!/usr/bin/env node

/**
 * Initialize Railway PostgreSQL Database
 * Run with: node scripts/init-railway-db.js
 * Requires: DATABASE_URL environment variable
 */

const { Pool } = require("pg");

async function initDatabase() {
  try {
    // Get DATABASE_URL from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error("❌ DATABASE_URL not set");
      process.exit(1);
    }

    console.log("[INIT] Connecting to database...");
    const pool = new Pool({
      connectionString: dbUrl,
      max: 5,
    });

    const client = await pool.connect();
    console.log("✅ Connected to database");

    // Create products table
    console.log("[INIT] Creating products table...");
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
    console.log("✅ Products table created/verified");

    // Create reviews table
    console.log("[INIT] Creating reviews table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        productId TEXT NOT NULL,
        author VARCHAR NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        content TEXT NOT NULL,
        date DATE NOT NULL,
        avatarColor VARCHAR,
        verified_purchase BOOLEAN DEFAULT false,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (productId) REFERENCES products(id)
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews(productId);
      CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
    `);
    console.log("✅ Reviews table created/verified");

    // Check existing products
    const result = await client.query("SELECT COUNT(*) as count FROM products");
    const productCount = parseInt(result.rows[0].count);
    console.log(`[INFO] Current products in DB: ${productCount}`);

    if (productCount === 0) {
      console.log("[INIT] Loading sample products...");

      const products = [
        {
          id: "p-009",
          name: "Boîte d'activités Hape",
          slug: "boite-activites-hape",
          category: "jouets-bebe",
          categoryName: "Jouets bébé",
          description: "Boîte d'activités 5 faces avec engrenages, boules, blocs",
          price: 36.4,
          oldPrice: null,
          rating: 4.8,
          reviewCount: 245,
          inStock: true,
          images: ["/products/boite-activites-hape-1.png"],
          materials: ["Bois", "Plastique"],
          safety: ["Certifié CE"],
          badge: "Populaire",
          bgClass: "bg-amber-50",
        },
        {
          id: "p-015",
          name: "O-Ball - Ballon sensoriel",
          slug: "balle-prehension-multicolore",
          category: "jouets-bebe",
          categoryName: "Jouets bébé",
          description: "Ballon avec trous pour une bonne prise",
          price: 7.8,
          oldPrice: null,
          rating: 4.7,
          reviewCount: 180,
          inStock: true,
          images: ["/products/balle-prehension-1.png"],
          materials: ["Plastique"],
          safety: ["Certifié CE"],
          badge: null,
          bgClass: "bg-blue-50",
        },
        {
          id: "p-017",
          name: "Cube sensoriel Ludi",
          slug: "cube-sensoriel-ludi",
          category: "jouets-bebe",
          categoryName: "Jouets bébé",
          description: "Cube avec 6 activités différentes",
          price: 13.9,
          oldPrice: null,
          rating: 4.8,
          reviewCount: 92,
          inStock: true,
          images: ["/products/cube-sensoriel-ludi-1.png"],
          materials: ["Tissu", "Plastique"],
          safety: ["Certifié CE"],
          badge: "Nouveau",
          bgClass: "bg-pink-50",
        },
      ];

      for (const product of products) {
        await client.query(
          `INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO UPDATE SET 
             price = $7, oldPrice = $8, rating = $9, reviewCount = $10`,
          [
            product.id,
            product.name,
            product.slug,
            product.category,
            product.categoryName,
            product.description,
            product.price,
            product.oldPrice,
            product.rating,
            product.reviewCount,
            product.inStock,
            product.images,
            product.materials,
            product.safety,
            product.badge,
            product.bgClass,
          ]
        );
      }

      console.log(`✅ Loaded ${products.length} products`);
    }

    client.release();
    await pool.end();

    console.log("\n✅ Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

initDatabase();
