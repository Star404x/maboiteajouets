const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products SET 
        price = $2,
        stripeLink = $3
       WHERE id = $1
       RETURNING id, name, price`,
      [
        "p-034", // ID товара
        43.50, // Новая цена из Stripe ссылки
        "https://buy.stripe.com/00w28qdQP2RHaG0gj0fw400" // Stripe ссылка
      ]
    );

    console.log("✅ Товар обновлен:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct().catch(console.error);
