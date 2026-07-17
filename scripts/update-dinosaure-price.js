const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updatePrice() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products 
       SET price = $1
       WHERE slug = $2
       RETURNING id, name, price`,
      [86.80, "table-activites-dinosaure"]
    );

    if (result.rows.length > 0) {
      console.log("✅ Цена обновлена:", result.rows[0]);
    } else {
      console.log("❌ Товар не найден");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

updatePrice();
