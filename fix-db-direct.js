const { Pool } = require('pg');
const PRODUCTS = require('./src/lib/data/products').PRODUCTS;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔧 Starting database fix...');
    
    // 1. Clear old products
    await client.query('DELETE FROM products');
    console.log('✅ Cleared products table');
    
    // 2. Insert all products
    let inserted = 0;
    for (const product of PRODUCTS) {
      try {
        await client.query(
          `INSERT INTO products (id, slug, name, category, categoryName, description, price, rating, "reviewCount", age, images)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            product.id,
            product.slug,
            product.name,
            product.category,
            product.categoryName,
            product.description,
            product.price,
            product.rating,
            product.reviewCount || 0,
            JSON.stringify(product.age || []),
            JSON.stringify(product.images || [])
          ]
        );
        inserted++;
      } catch (e) {
        console.warn(`⚠️  Skipped ${product.id}:`, e.message.substring(0, 80));
      }
    }
    console.log(`✅ Inserted ${inserted} products`);
    
    // 3. Verify
    const result = await client.query(`
      SELECT COUNT(*) as total, 
             SUM(CASE WHEN slug IS NULL THEN 1 ELSE 0 END) as null_slugs
      FROM products
    `);
    const { total, null_slugs } = result.rows[0];
    
    console.log(`📊 Stats:
    - Total products: ${total}
    - NULL slugs: ${null_slugs}
    - Database clean: ${null_slugs === 0 ? '✅ YES' : '❌ NO'}`);
    
    // 4. Check Cube price
    const cubeResult = await client.query(`
      SELECT price FROM products WHERE name LIKE '%Cube de manipulation%' LIMIT 1
    `);
    
    if (cubeResult.rows.length > 0) {
      const price = cubeResult.rows[0].price;
      console.log(`🧩 Cube de manipulation price: ${price}€ (expected 36.9€)`);
      if (price == 36.9) {
        console.log('✅ PRICE CORRECT!');
      }
    } else {
      console.log('❌ Cube de manipulation NOT FOUND');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

fixDatabase();
