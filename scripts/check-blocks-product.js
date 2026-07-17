const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function check() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, images FROM products WHERE id = 'p-030'`
    );
    
    if (result.rows.length > 0) {
      const p = result.rows[0];
      console.log(`Product: ${p.id} - ${p.name}`);
      console.log(`Images count: ${p.images.length}`);
      console.log(`Images: ${JSON.stringify(p.images, null, 2)}`);
    } else {
      console.log("Product not found");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

check();
