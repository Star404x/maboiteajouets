/**
 * Add Database Indexes for Performance
 * Usage: node scripts/add-indexes.js
 */

const { Pool } = require('pg');

async function addIndexes() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  const indexes = [
    // Products indexes
    'CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)',
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
    'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',

    // Users indexes
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
    'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC)',

    // Orders indexes
    'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',

    // Reviews indexes
    'CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)',
    'CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC)',

    // Wishlists indexes
    'CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id)',

    // User addresses indexes
    'CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_addresses_is_default ON user_addresses(is_default) WHERE is_default = true',

    // User activity indexes
    'CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action)',
    'CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC)',
  ];

  const client = await pool.connect();

  try {
    console.log('[INDEXES] Starting index creation...\n');

    for (const indexSql of indexes) {
      try {
        await client.query(indexSql);
        const indexName = indexSql.match(/idx_\w+/)[0];
        console.log(`✅ Created: ${indexName}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          const indexName = indexSql.match(/idx_\w+/)[0];
          console.log(`⚠️  Already exists: ${indexName}`);
        } else {
          console.error(`❌ Error: ${err.message}`);
        }
      }
    }

    // Verify indexes
    const result = await client.query(`
      SELECT 
        tablename,
        COUNT(*) as index_count
      FROM pg_indexes
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename
    `);

    console.log('\n[INDEXES] Summary by table:');
    result.rows.forEach(row => {
      console.log(`  ${row.tablename}: ${row.index_count} indexes`);
    });

    console.log('\n✅ Index creation complete!');
  } catch (err) {
    console.error('❌ Fatal error:', err);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
}

addIndexes();
