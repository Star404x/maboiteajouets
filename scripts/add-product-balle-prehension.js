const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function addProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO products (id, name, slug, category, categoryName, description, price, oldPrice, rating, reviewCount, inStock, images, materials, safety, badge, bgClass)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING id, name`,
      [
        "p-015",
        "Balle de préhension multi-couleur caoutchouc",
        "balle-prehension-multicolore",
        "jouets-eveil",
        "Jouets d'Éveil",
        "Balle multicolore de préhension en caoutchouc, conçue pour reprendre toujours sa forme d'origine. Très légère et facile à lancer, idéale pour les petites mains en développement. Stimule les sens et favorise le développement sensoriel des tout-petits. Diamètre 11,5 cm. Conforme aux normes CE et NF EN 71-1/2/3.",
        7.80,
        null,
        4.7,
        12,
        true,
        [
          "/products/balle-prehension-1.jpg",
          "/products/balle-prehension-2.jpg",
          "/products/balle-prehension-3.jpg",
          "/products/balle-prehension-4.jpg",
          "/products/balle-prehension-5.jpg",
        ],
        ["Caoutchouc"],
        [
          "Certifié CE",
          "Normes NF EN 71-1/2/3",
          "Garantie 1 an",
          "Très légère et sans danger",
        ],
        null,
        "bg-gradient-to-br from-yellow-50 to-red-50"
      ]
    );

    if (result.rows.length > 0) {
      console.log("✅ Product added successfully:");
      console.log("   ID:", result.rows[0].id);
      console.log("   Name:", result.rows[0].name);
    } else {
      console.log("❌ Failed to add product");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addProduct();
