const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function restoreProducts() {
  const client = await pool.connect();
  try {
    // Восстанавливаем удаленные товары
    const productsToRestore = [
      {
        id: "p-016",
        slug: "cube-sensoriel-ludi",
        name: "Cube sensoriel Ludi",
        category: "jouets-bebe",
        categoryName: "Jouets bébé",
        description: "Cube avec différentes activités sensorielles pour l'éveil de bébé.",
        price: 13.9,
        rating: 4.8,
        reviewCount: 45,
        age: ["0-12m", "1-3"],
        images: ["/products/cube-sensoriel-ludi-1.png"],
        inStock: true,
        stockCount: 30,
        materials: ["Tissu", "Plastique"],
        safety: ["Certifié CE"],
        color: "sky",
        bgClass: "bg-[#F0F7FE]",
      },
      {
        id: "p-018",
        slug: "tapis-eveil-bois",
        name: "Tapis d'éveil en bois",
        category: "tapis-bebe",
        categoryName: "Tapis bébé",
        description: "Tapis d'éveil naturel en bois avec arche de jeu.",
        price: 69.9,
        rating: 4.9,
        reviewCount: 56,
        age: ["0-12m", "1-3"],
        images: ["/products/tapis-eveil-bois-1.png"],
        inStock: true,
        stockCount: 15,
        materials: ["Bois FSC", "Tissu bio"],
        safety: ["Certifié CE"],
        color: "pink",
        bgClass: "bg-gradient-to-br from-pink-100 to-pink-50",
      },
      {
        id: "p-019",
        slug: "portique-arceau-animal",
        name: "Portique Arceau Animal",
        category: "jouets-bebe",
        categoryName: "Jouets bébé",
        description: "Portique d'éveil pliable avec jouets sensoriels attachés.",
        price: 64.8,
        rating: 4.8,
        reviewCount: 62,
        age: ["0-12m", "1-3"],
        images: ["/products/portique-arceau-animal-1.png"],
        inStock: true,
        stockCount: 18,
        materials: ["Bois", "Tissu"],
        safety: ["Certifié CE"],
        color: "sky",
        bgClass: "bg-[#F0F7FE]",
      },
      {
        id: "p-020",
        slug: "mobile-musical-penguin",
        name: "Mobile Musical Penguin & Pals",
        category: "tapis-bebe",
        categoryName: "Tapis bébé",
        description: "Mobile musical avec pingouins pour l'éveil sensoriel.",
        price: 46.8,
        rating: 4.7,
        reviewCount: 38,
        age: ["0-12m"],
        images: ["/products/mobile-musical-penguin-1.png"],
        inStock: true,
        stockCount: 22,
        materials: ["Peluche", "Plastique"],
        safety: ["Certifié CE"],
        color: "pink",
        bgClass: "bg-gradient-to-br from-pink-100 to-pink-50",
      },
    ];

    for (const product of productsToRestore) {
      await client.query(
        `INSERT INTO products (id, slug, name, category, categoryName, description, price, rating, reviewCount, age, images, inStock, stockCount, materials, safety, color, bgClass)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         ON CONFLICT (id) DO UPDATE SET
         category = $4, categoryName = $5, description = $6, price = $7, images = $11`,
        [
          product.id,
          product.slug,
          product.name,
          product.category,
          product.categoryName,
          product.description,
          product.price,
          product.rating,
          product.reviewCount,
          product.age,
          product.images,
          product.inStock,
          product.stockCount,
          product.materials,
          product.safety,
          product.color,
          product.bgClass,
        ]
      );
      console.log(`✅ Восстановлен: ${product.id} - ${product.name}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

restoreProducts();
