const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkReviewCounts() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT id, name, reviewcount FROM products ORDER BY id LIMIT 10"
    );
    console.log("Review counts from database:");
    result.rows.forEach((row) => {
      console.log(`  ${row.id}: ${row.name} - reviewcount: ${row.reviewcount}`);
    });
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkReviewCounts();
