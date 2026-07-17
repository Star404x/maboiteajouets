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
        `p-025`,
        `Table à balles fun ball`,
        `table-balles-fun-ball`,
        `jeux-exterieur`,
        `Jeux d'extérieur`,
        `Table à balles STEM Discovery de Step2. Dimensions: 76,2 x 71,1 x 77,5 cm. Capacité: 15 litres. Plastique EverTough durable. Inclut rampе, poulie, flipper et 10 balles. À partir de 2 ans.`,
        168.80,
        null,
        4.7,
        16,
        true,
        ['/products/table-balles-fun-ball-1.png', '/products/table-balles-fun-ball-2.png', '/products/table-balles-fun-ball-3.png', '/products/table-balles-fun-ball-4.png', '/products/table-balles-fun-ball-5.png', '/products/table-balles-fun-ball-6.png', '/products/table-balles-fun-ball-7.png', '/products/table-balles-fun-ball-8.png', '/products/table-balles-fun-ball-9.png', '/products/table-balles-fun-ball-10.png'],
        ['Plastique EverTough'],
        ['CE', 'USA', 'Dès 2 ans'],
        'Nouveau',
        'bg-gradient-to-br from-yellow-100 to-orange-50'
      ]
    );
    console.log("✅ Product added:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
