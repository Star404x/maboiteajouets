const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='products' ORDER BY column_name"
    );
    console.log("Products table columns:");
    result.rows.forEach((col) => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
