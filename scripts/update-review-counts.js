const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const updates = {
  "p-009": 4,
  "p-015": 5,
  "p-016": 4,
  "p-017": 4,
  "p-018": 4,
  "p-019": 4,
  "p-020": 4,
  "p-021": 4,
  "p-022": 5,
  "p-023": 5,
  "p-024": 4,
  "p-025": 4,
  "p-026": 4,
  "p-027": 4,
  "p-028": 4,
  "p-029": 4,
  "p-030": 4,
  "p-031": 3,
  "p-032": 3,
  "p-033": 3,
  "p-034": 3,
  "p-035": 3,
  "p-036": 3,
  "p-037": 3,
  "p-038": 4,
};

async function updateReviewCounts() {
  const client = await pool.connect();
  try {
    for (const [id, count] of Object.entries(updates)) {
      await client.query(
        "UPDATE products SET reviewcount = $1 WHERE id = $2",
        [count, id]
      );
      console.log(`✅ Updated ${id} to ${count} reviews`);
    }
    console.log("\n✅ All review counts updated!");
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  } finally {
    client.release();
    await pool.end();
  }
}

updateReviewCounts();
