const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function process() {
  const client = await pool.connect();
  try {
    // Delete
    console.log("Deleting old product...");
    await client.query(`DELETE FROM products WHERE id = 'p-030'`);
    console.log("✅ Deleted");
    
    // Add new with all 10 images
    console.log("\nAdding product with 10 images...");
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING id, name, images`,
      [
        "p-030",
        "Mes premiers blocks de construction M",
        "blocks-construction-m",
        "jeux-de-construction",
        "Jeux de Construction",
        "118 pièces pour assembler diverses compositions. Développe l'imagination, la motricité et la perception de l'espace.",
        74.95,
        4.8,
        0,
        true,
        ['/products/blocks-construction-m-1.png', '/products/blocks-construction-m-2.png', '/products/blocks-construction-m-3.png', '/products/blocks-construction-m-4.png', '/products/blocks-construction-m-5.png', '/products/blocks-construction-m-6.png', '/products/blocks-construction-m-7.png', '/products/blocks-construction-m-8.png', '/products/blocks-construction-m-9.png', '/products/blocks-construction-m-10.png'],
        ["Plastique", "Boîte en plastique"],
        ["CE", "Garantie 2 ans"],
        "Nouveau",
        "bg-gradient-to-br from-amber-100 to-yellow-50"
      ]
    );
    
    console.log("✅ Product added:", result.rows[0].id);
    console.log(`📸 Images: ${result.rows[0].images.length}`);
  } finally {
    client.release();
    await pool.end();
  }
}

process();
