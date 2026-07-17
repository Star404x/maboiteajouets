const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function createSchema() {
  const client = await pool.connect();
  try {
    console.log("🔧 Создание схемы для заказов...\n");

    await client.query("BEGIN");

    // 1. Таблица клиентов
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    // Индекс по email (не UNIQUE — клиент может заказывать без регистрации несколько раз)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);`);
    console.log("✅ customers");

    // 2. Адреса доставки
    await client.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        postal_code VARCHAR(20) NOT NULL,
        city VARCHAR(100) NOT NULL,
        country VARCHAR(2) DEFAULT 'FR',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_addresses_customer ON addresses(customer_id);`);
    console.log("✅ addresses");

    // 3. Заказы
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES customers(id),
        shipping_address_id INT REFERENCES addresses(id),
        subtotal_cents INT NOT NULL,
        shipping_cents INT NOT NULL DEFAULT 0,
        total_cents INT NOT NULL,
        currency VARCHAR(3) DEFAULT 'EUR',
        status VARCHAR(30) NOT NULL DEFAULT 'pending',
        stripe_payment_intent_id VARCHAR(255),
        stripe_charge_id VARCHAR(255),
        payment_status VARCHAR(30) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        paid_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_pi ON orders(stripe_payment_intent_id);`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);`);
    console.log("✅ orders");

    // 4. Позиции заказа
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(50),
        product_slug VARCHAR(255),
        product_name VARCHAR(255) NOT NULL,
        product_image VARCHAR(500),
        unit_price_cents INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        line_total_cents INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);`);
    console.log("✅ order_items");

    // 5. События заказа (audit log)
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_events (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_events(order_id);`);
    console.log("✅ order_events");

    await client.query("COMMIT");

    console.log("\n📊 Проверка структуры:\n");
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public' 
      ORDER BY table_name
    `);
    tables.rows.forEach((r) => console.log("  •", r.table_name));

    console.log("\n✅ Схема заказов создана успешно!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("❌ Ошибка:", e.message);
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

createSchema().catch((e) => {
  console.error(e);
  process.exit(1);
});
