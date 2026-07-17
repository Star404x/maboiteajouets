const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products SET images = $1 WHERE id = $2 RETURNING id, name`,
      [
        [
          '/products/tapis-activites-montgolfiere-1.png',
          '/products/tapis-activites-montgolfiere-2.png',
          '/products/tapis-activites-montgolfiere-3.png',
          '/products/tapis-activites-montgolfiere-4.png',
          '/products/tapis-activites-montgolfiere-5.png',
          '/products/tapis-activites-montgolfiere-6.png',
          '/products/tapis-activites-montgolfiere-7.png',
          '/products/tapis-activites-montgolfiere-8.png',
          '/products/tapis-activites-montgolfiere-9.png',
          '/products/tapis-activites-montgolfiere-10.png'
        ],
        'p-021'
      ]
    );
    console.log("✅ Product updated:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct();
