const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, "stripeLink" FROM products WHERE id = 'p-034'`
    );
    console.log("С кавычками:", result.rows[0]);
    
    const result2 = await client.query(
      `SELECT id, name, stripelink FROM products WHERE id = 'p-034'`
    );
    console.log("Без кавычек:", result2.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

test().catch(console.error);
