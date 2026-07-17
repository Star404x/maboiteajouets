const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkImages() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, name, images FROM products WHERE id = 'p-016';`
    );

    const product = result.rows[0];
    if (!product) {
      console.log("❌ Товар p-016 не найден");
      return;
    }

    console.log(`📦 ${product.id}: ${product.name}`);
    console.log(`Images: ${JSON.stringify(product.images)}\n`);

    const publicDir = path.join(__dirname, "../public/products");
    console.log("Проверка файлов:");

    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const filename = img.replace("/products/", "");
        const filePath = path.join(publicDir, filename);
        const exists = fs.existsSync(filePath);
        const status = exists ? "✅" : "❌";
        console.log(`  ${status} ${filename}`);
      });
    } else {
      console.log("  ❌ Массив images пуст");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

checkImages();
