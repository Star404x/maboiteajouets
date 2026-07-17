const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://netlifydb_owner:npg_uM9rTGXN2OUI@ep-soft-night-ajfp1t6i.c-3.us-east-2.db.netlify.com/netlifydb?sslmode=require",
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    // Обновляем товар с полными характеристиками
    const result = await client.query(
      `UPDATE products 
       SET 
         description = $1,
         materials = $2,
         safety = $3,
         age = $4,
         dimensions = $5
       WHERE slug = $6
       RETURNING id, name, description, materials, age, dimensions`,
      [
        // Развернутое описание на французском
        `Partez pour un voyage extraordinaire au cœur de l'ère des dinosaures avec cette incroyable table d'activités en bois ! Cette table, aux teintes rouilles et bleues vibrantes, transporte les petits explorateurs dans un univers jurassique fascinant.

Cette table d'aventures palpitantes offre 8 activités variées, conçues pour stimuler la curiosité, la motricité et la concentration des tout-petits :
- Circuit du tricératops : Faites rouler le tricératops sur son circuit, le faisant passer sous le volcan pour déclencher un tintement joyeux
- Boulier dinosaure : Explorez le monde des dinosaures avec un boulier de 10 perles en bois accompagné d'un ptéranodon volant
- Roues à engrenages pour développer la motricité fine
- Miroir rotatif pour une dimension ludique
- Œuf sonore pour l'éveil auditif
- Zones de jeux colorées et détails enchanteurs
- Éléments en feutrine douce représentant la fumée du volcan
- Dinosaures aux yeux ronds et petits œufs animés

Cette table d'activités regorge de détails captivants qui stimulent l'imagination. Les roues à engrenages, l'œuf sonore et le miroir rotatif ajoutent une dimension sensorielle enrichissante à l'expérience de jeu.`,
        
        // Материалы
        ["Bois FSC®", "Feutrine", "Plastique sans BPA"],
        
        // Безопасность / нормы
        ["Conforme CE", "Conforme NF", "Garantie 2 ans"],
        
        // Возраст
        ["12 mois et +"],
        
        // Размеры
        "40 x 32 x 52,5 cm (hauteur du plateau: 32 cm)",
        
        // Slug товара
        "table-activites-dinosaure"
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
