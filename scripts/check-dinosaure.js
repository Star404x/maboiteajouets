const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function checkProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, slug, price, description, materials, age, dimensions, safety
       FROM products 
       WHERE slug = 'table-activites-dinosaure'`
    );

    if (result.rows.length > 0) {
      const product = result.rows[0];
      console.log("✅ ТОВАР НАЙДЕН В БД:\n");
      console.log("📌 ID:", product.id);
      console.log("📌 Название:", product.name);
      console.log("📌 Slug:", product.slug);
      console.log("💰 Цена:", product.price);
      console.log("\n📝 ОПИСАНИЕ:");
      console.log(product.description.substring(0, 200) + "...");
      console.log("\n🔧 МАТЕРИАЛЫ:", product.materials);
      console.log("👶 ВОЗРАСТ:", product.age);
      console.log("📐 РАЗМЕРЫ:", product.dimensions);
      console.log("✔️ БЕЗОПАСНОСТЬ:", product.safety);
    } else {
      console.log("❌ Товар не найден");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

checkProduct();
