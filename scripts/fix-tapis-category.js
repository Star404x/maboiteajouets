const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixCategory() {
  const client = await pool.connect();
  try {
    // p-019 Portique перемещаем в tapis-bebe
    await client.query(
      `UPDATE products SET category = 'tapis-bebe', categoryName = 'Tapis bébé' WHERE id = 'p-019'`
    );
    console.log("✅ p-019 Portique перемещен в tapis-bebe");

    // Проверяем
    const result = await client.query(
      `SELECT id, name, category FROM products WHERE category IN ('jouets-bebe', 'tapis-bebe') ORDER BY id;`
    );

    console.log("\n👶 jouets-bebe:");
    result.rows
      .filter((r) => r.category === "jouets-bebe")
      .forEach((r) => console.log(`  ${r.id}: ${r.name}`));

    console.log("\n🛏️ tapis-bebe:");
    result.rows
      .filter((r) => r.category === "tapis-bebe")
      .forEach((r) => console.log(`  ${r.id}: ${r.name}`));
  } finally {
    client.release();
    await pool.end();
  }
}

fixCategory();
