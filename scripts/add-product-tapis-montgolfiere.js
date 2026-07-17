const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products SET category = $1, categoryName = $2 WHERE id = $3 RETURNING id, name, category`,
      [`tapis-bebe`, `Tapis bébé`, `p-021`]
    );
    if (result.rows.length === 0) {
      console.log("Товар не найден. Добавляю новый...");
      const insertResult = await client.query(
        `INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING id, name`,
      [
        `p-021`,
        `Tapis d'activités avec arche montgolfière`,
        `tapis-activites-montgolfiere`,
        `tapis-bebe`,
        `Tapis bébé`,
        `Tapis d'éveil avec arche montgolfière amovible. Stimule la motricité et la dextérité de bébé dès la naissance. Dimensions: 119 x 49 x 91 cm. 100% polyester, lavable en machine. 3 jouets amovibles inclus.`,
        49.90,
        null,
        4.5,
        8,
        true,
        ['/products/tapis-activites-montgolfiere-1.png', '/products/tapis-activites-montgolfiere-2.png', '/products/tapis-activites-montgolfiere-3.png', '/products/tapis-activites-montgolfiere-4.png', '/products/tapis-activites-montgolfiere-5.png'],
        ['100% polyester'],
        ['CE'],
        'Nouveau',
        'bg-gradient-to-br from-amber-100 to-orange-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
