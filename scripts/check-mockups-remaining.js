const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkMockups() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, images FROM products WHERE images[1] ~ '[🧩🍳🧸🐰🦕🤖🏠]' OR images[1] = '🧩' OR images[1] = '🍳' OR images[1] = '🧸' OR images[1] = '🐰' OR images[1] = '🦕' OR images[1] = '🤖' OR images[1] = '🏠' ORDER BY id;`
    );

    if (result.rowCount === 0) {
      console.log("✅ Все макеты удалены из БД!");
      console.log("Товаров в БД: " + result.rowCount);
    } else {
      console.log("⚠️ Ещё остались макеты:");
      result.rows.forEach((row) => {
        console.log(`${row.id}: ${row.name} → ${JSON.stringify(row.images)}`);
      });
    }
  } finally {
    client.release();
    await pool.end();
  }
}

checkMockups();
