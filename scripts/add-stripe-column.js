const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addColumn() {
  const client = await pool.connect();
  try {
    // Проверяем есть ли уже колонка
    const checkResult = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name='products' AND column_name='stripeLink'`
    );
    
    if (checkResult.rows.length === 0) {
      // Добавляем колонку
      await client.query(
        `ALTER TABLE products ADD COLUMN stripeLink TEXT DEFAULT NULL`
      );
      console.log("✅ Колонка stripeLink добавлена");
    } else {
      console.log("✅ Колонка stripeLink уже существует");
    }

    // Обновляем цену и Stripe ссылку
    const updateResult = await client.query(
      `UPDATE products SET 
        price = $2,
        stripeLink = $3
       WHERE id = $1
       RETURNING id, name, price, stripeLink`,
      [
        "p-034",
        43.50,
        "https://buy.stripe.com/00w28qdQP2RHaG0gj0fw400"
      ]
    );

    console.log("✅ Товар обновлен:", updateResult.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addColumn().catch(console.error);
