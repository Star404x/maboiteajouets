const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function check() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, price, stripeLink FROM products WHERE id = 'p-034'`
    );
    console.log(JSON.stringify(result.rows[0], null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

check();
