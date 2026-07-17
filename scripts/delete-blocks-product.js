const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function deleteProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `DELETE FROM products WHERE id = 'p-030' RETURNING id, name`
    );
    if (result.rows.length > 0) {
      console.log("✅ Product deleted:", result.rows[0]);
    } else {
      console.log("❌ Product not found");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

deleteProduct();
