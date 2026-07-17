const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateImages() {
  const client = await pool.connect();
  try {
    // Обновляем изображения для Cube sensoriel Ludi с реальными фотографиями
    const images = [
      "/products/cube-sensoriel-ludi-1.png",
      "/products/cube-sensoriel-ludi-2.png",
      "/products/cube-sensoriel-ludi-3.png",
      "/products/cube-sensoriel-ludi-4.png",
      "/products/cube-sensoriel-ludi-5.png",
      "/products/cube-sensoriel-ludi-6.png",
      "/products/cube-sensoriel-ludi-7.png",
      "/products/cube-sensoriel-ludi-8.png",
      "/products/cube-sensoriel-ludi-9.png",
      "/products/cube-sensoriel-ludi-10.png",
    ];

    await client.query(
      `UPDATE products SET images = $1 WHERE id = 'p-016'`,
      [images]
    );

    console.log("✅ Обновлены реальные фотографии для p-016 Cube sensoriel Ludi");
    console.log(`   Загружено: ${images.length} фотографий`);
  } finally {
    client.release();
    await pool.end();
  }
}

updateImages();
