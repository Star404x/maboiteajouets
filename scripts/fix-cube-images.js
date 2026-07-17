const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixImages() {
  const client = await pool.connect();
  try {
    // Вариант 1: Используем фото O-Ball для Cube как временное решение
    const images = [
      "/products/balle-prehension-1.png",
      "/products/balle-prehension-2.png",
      "/products/balle-prehension-3.png",
      "/products/balle-prehension-4.png",
      "/products/balle-prehension-5.png",
    ];

    await client.query(
      `UPDATE products SET images = $1 WHERE id = 'p-016'`,
      [images]
    );

    console.log("✅ Обновлены изображения для p-016 Cube sensoriel Ludi");
    console.log(`   Используются фото O-Ball (временное решение)`);
    console.log(`   Images: ${JSON.stringify(images)}`);
  } finally {
    client.release();
    await pool.end();
  }
}

fixImages();
