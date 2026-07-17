const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function deleteProducts() {
  const client = await pool.connect();
  try {
    const result1 = await client.query(
      `DELETE FROM products WHERE id = $1 RETURNING id, name`,
      ["p-002"]
    );
    const result2 = await client.query(
      `DELETE FROM products WHERE id = $1 RETURNING id, name`,
      ["p-010"]
    );
    
    if (result1.rows.length > 0) {
      console.log("✅ Deleted:", result1.rows[0]);
    }
    if (result2.rows.length > 0) {
      console.log("✅ Deleted:", result2.rows[0]);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

deleteProducts();
