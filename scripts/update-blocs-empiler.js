const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `UPDATE products 
       SET 
         description = $1,
         materials = $2,
         safety = $3,
         age = $4,
         dimensions = $5,
         price = $6
       WHERE slug = $7
       RETURNING id, name, description, materials, age, dimensions, price`,
      [
        // Развернутое описание на французском
        `Ce set de 10 blocs à empiler est pensé pour les jeunes enfants. Les blocs sont en bois, avec des bords en silicone souple. Ils sont faciles à prendre en main et plus silencieux quand ils tombent ou s'entrechoquent.

Activités variées et libres :
- Empiler les blocs pour créer des tours
- Aligner et observer les lettres, les chiffres et les motifs
- Trier les blocs par couleur
- Inventer de petites constructions personnelles

Ce jeu laisse une vraie place à la motricité libre. L'enfant choisit sa façon de jouer, seul ou avec l'adulte à côté. Il manipule, recommence, ajuste son geste. C'est simple, mais très riche pour le développement de l'enfant.

Bénéfices développementaux :
- Stimule la motricité fine et la coordination œil-main
- Favorise l'autonomie et l'exploration
- Soutient l'éveil, la concentration et les premières notions de tri
- Idéal pour une utilisation en crèche, micro-crèche ou MAM

Parfait pour les temps d'éveil, sur un tapis ou dans un coin calme de l'espace enfant.`,
        
        // Материалы
        ["Bois", "Silicone souple"],
        
        // Безопасность / нормы
        ["Conforme CE"],
        
        // Возраст (NOTE: Pour ce produit c'est 6 mois +, pas 12!)
        ["6 mois et +"],
        
        // Размеры
        "5,5 x 18 x 21 cm (set de 10 blocs)",
        
        // Новая цена
        47.90,
        
        // Slug товара
        "blocs-empiler-10-pieces"
      ]
    );

    if (result.rows.length > 0) {
      console.log("✅ Товар успешно обновлён:", result.rows[0]);
    } else {
      console.log("❌ Товар не найден");
    }
  } catch (err) {
    console.error("❌ Ошибка:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct();
