const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listAll() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, images[1] as first_image FROM products ORDER BY id;`
    );

    console.log(`Total: ${result.rowCount} products\n`);
    result.rows.forEach((row) => {
      const img = row.first_image || '(no image)';
      const isMockup = img.match(/[🧩🍳🧸🐰🦕🤖🏠]/);
      const status = isMockup ? '❌ MOCKUP' : '✅ REAL';
      console.log(`${status} | ${row.id.padEnd(6)} | ${row.name.substring(0, 40).padEnd(40)} | ${img}`);
    });
  } finally {
    client.release();
    await pool.end();
  }
}

listAll();
