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
        `Ces 4 minis véhicules zoomeurs sont de véritables petites fusées sur roues ! Grâce à leur système de propulsion "push-down", il suffit de les faire reculer légèrement sur une surface plane pour qu'ils s'élancent à toute vitesse.

Contenu et fonctionnement :
- 4 mini véhicules colorés avec système push-down
- Propulsion simple : reculez et relâchez pour action
- Format compact et facile à manipuler
- Sans piles ni entretien requis

Caractéristiques de sécurité :
Faciles à manipuler pour les petites mains, ils sont conçus avec des bords arrondis pour une utilisation en toute sécurité, même par les enfants de 12 mois. Robustes et colorés, ils attirent naturellement l'attention et encouragent les jeux d'imitation et les interactions collectives entre enfants.

Développement de l'enfant :
- Développe la motricité fine et la coordination
- Stimule l'imagination avec les jeux de course
- Encourage le jeu collectif et les interactions
- Parfait pour les ateliers de manipulation
- Idéal pour les coins voitures dans les espaces de jeu

Avantages pratiques :
Particulièrement adaptés aux environnements collectifs - crèche, micro-crèche, EAJE - ces véhicules sont durables, faciles à nettoyer et toujours prêts à l'action. Une valeur sûre pour animer les journées avec les enfants.`,
        
        // Материалы
        ["Plastique robuste"],
        
        // Безопасность / нормы
        ["Conforme CE", "Sans batterie", "Bords arrondis sécurisés"],
        
        // Возраст
        ["À partir de 12 mois"],
        
        // Размеры (compact format mentioned)
        "Format compact - idéal pour le jeu portable",
        
        // Новая цена
        46.80,
        
        // Slug товара
        "lot-mini-vehicules"
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
