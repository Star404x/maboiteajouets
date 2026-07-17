const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, name`,
      [
        `p-022`,
        `Panier de Basket Réglable`,
        `panier-basket-reglable`,
        `jeux-exterieur`,
        `Jeux d'extérieur`,
        `Panier de basket réglable de 117 à 177 cm. Parfait pour développer la coordination et l'activité physique. Système de roues pour déplacement facile. Largeur 72 cm, diamètre kringue 26 cm.`,
        131.72,
        null,
        4.7,
        12,
        true,
        ['/products/panier-basket-reglable-1.png', '/products/panier-basket-reglable-2.png', '/products/panier-basket-reglable-3.png', '/products/panier-basket-reglable-4.png', '/products/panier-basket-reglable-5.png', '/products/panier-basket-reglable-6.png', '/products/panier-basket-reglable-7.png', '/products/panier-basket-reglable-8.png', '/products/panier-basket-reglable-9.png'],
        ['Acier', 'Plastique'],
        ['CE', 'EN-71', 'Europe'],
        'Nouveau',
        'bg-gradient-to-br from-blue-100 to-cyan-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
