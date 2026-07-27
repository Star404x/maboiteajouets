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
      )
    `);
    console.log("[INIT] ✅ Products table");

    // Create reviews table with explicit error handling
    console.log("[INIT] Creating reviews table...");
    try {
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
        )
      `);
      
      // Create indexes separately
      await client.query(`CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews(productId)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)`);
      
      console.log("[INIT] ✅ Reviews table");
    } catch (e) {
      const err = e as any;
      console.error("[INIT] ⚠️ Reviews table:", err.message);
      if (!err.message?.includes("already exists")) {
        throw e;
      }
    }

    // Create orders table
    console.log("[INIT] Creating orders table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_email VARCHAR NOT NULL,
        customer_name VARCHAR,
        status VARCHAR DEFAULT 'pending',
        total_amount DECIMAL NOT NULL,
        currency VARCHAR DEFAULT 'EUR',
        payment_intent_id VARCHAR UNIQUE,
        items JSONB,
        shipping_address JSONB,
        billing_address JSONB,
        shipping_cost DECIMAL DEFAULT 0,
        tax DECIMAL DEFAULT 0,
        tracking_number VARCHAR,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("[INIT] ✅ Orders table");

    // Create users table (expanded)
    console.log("[INIT] Creating users table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR NOT NULL,
        full_name VARCHAR,
        phone VARCHAR,
        birth_date DATE,
        gender VARCHAR,
        newsletter BOOLEAN DEFAULT true,
        avatar_url VARCHAR,
        bio TEXT,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log("[INIT] ✅ Users table");

    // Create user_addresses table
    console.log("[INIT] Creating user_addresses table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR,
        first_name VARCHAR NOT NULL,
        last_name VARCHAR NOT NULL,
        street VARCHAR NOT NULL,
        city VARCHAR NOT NULL,
        postal_code VARCHAR NOT NULL,
        country VARCHAR NOT NULL,
        phone VARCHAR,
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON user_addresses(user_id)`);
    console.log("[INIT] ✅ User addresses table");

    // Create order_items table
    console.log("[INIT] Creating order_items table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        product_name VARCHAR NOT NULL,
        price DECIMAL NOT NULL,
        quantity INT NOT NULL,
        total DECIMAL NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)`);
    console.log("[INIT] ✅ Order items table");

    // Create wishlists table
    console.log("[INIT] Creating wishlists table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL,
        added_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id)`);
    console.log("[INIT] ✅ Wishlists table");

    // Create user_activity table
    console.log("[INIT] Creating user_activity table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR NOT NULL,
        details TEXT,
        ip_address VARCHAR,
        user_agent VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_activity_user_id ON user_activity(user_id)`);
    console.log("[INIT] ✅ User activity table");

    // Add user_id and user references to orders (if not exists)
    console.log("[INIT] Updating orders table...");
    try {
      await client.query(`
        ALTER TABLE orders 
        ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id),
        ADD COLUMN IF NOT EXISTS shipping_address_id TEXT REFERENCES user_addresses(id),
        ADD COLUMN IF NOT EXISTS items_count INT DEFAULT 0
      `);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)`);
      console.log("[INIT] ✅ Orders table updated");
    } catch (e) {
      console.warn("[INIT] Orders table update:", (e as Error).message);
    }

    // Insert sample reviews
    console.log("[INIT] Inserting sample data...");
    const sampleReviews = [
      { id: "r-001", productId: "p-009", author: "Marie D.", rating: 5, content: "Excellent qualité!", date: "2026-07-20", avatarColor: "pink" },
      { id: "r-002", productId: "p-009", author: "Jean P.", rating: 4, content: "Très bon produit", date: "2026-07-19", avatarColor: "blue" },
      { id: "r-003", productId: "p-015", author: "Sophie L.", rating: 5, content: "Adorable!", date: "2026-07-18", avatarColor: "green" },
      { id: "r-004", productId: "p-017", author: "Luc M.", rating: 4, content: "Bon rapport qualité-prix", date: "2026-07-17", avatarColor: "yellow" },
    ];

    for (const review of sampleReviews) {
      try {
        await client.query(
          `INSERT INTO reviews (id, productId, author, rating, content, date, avatarColor) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [review.id, review.productId, review.author, review.rating, review.content, review.date, review.avatarColor]
        );
      } catch (e) {
        console.warn("[INIT] Could not insert review:", (e as Error).message);
      }
    }

    console.log("[INIT] ✅ Sample data inserted");

    // Check final state
    const productCount = await client.query("SELECT COUNT(*) FROM products");
    const reviewCount = await client.query("SELECT COUNT(*) FROM reviews");
    const orderCount = await client.query("SELECT COUNT(*) FROM orders");
    const userCount = await client.query("SELECT COUNT(*) FROM users");

    client.release();
    pool.end();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      tables: {
        products: productCount.rows[0].count,
        reviews: reviewCount.rows[0].count,
        orders: orderCount.rows[0].count,
        users: userCount.rows[0].count,
      },
    });
  } catch (error) {
    console.error("[INIT] Fatal error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
