const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkCategories() {
  const client = await pool.connect();
  try {
    // Подсчитываем товары по категориям
    const result = await client.query(
      `SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category;`
    );

    console.log("\n📊 Товаров по категориям:\n");
    result.rows.forEach((row) => {
      console.log(`${row.category.padEnd(25)} | ${row.count} товаров`);
    });

    // Детально jouets-bebe
    console.log("\n👶 jouets-bebe товары:");
    const bebe = await client.query(
      `SELECT id, name FROM products WHERE category = 'jouets-bebe' ORDER BY id;`
    );
    bebe.rows.forEach((row) => {
      console.log(`  - ${row.id}: ${row.name}`);
    });

    // Детально tapis-bebe
    console.log("\n🛏️ tapis-bebe товары:");
    const tapis = await client.query(
      `SELECT id, name FROM products WHERE category = 'tapis-bebe' ORDER BY id;`
    );
    tapis.rows.forEach((row) => {
      console.log(`  - ${row.id}: ${row.name}`);
    });
  } finally {
    client.release();
    await pool.end();
  }
}

checkCategories();
