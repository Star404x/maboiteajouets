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
        `Ces pierres d'équilibre en bois constituent un jeu de manipulation aussi esthétique que stimulant pour les jeunes enfants. Composé de 20 pierres aux formes variées et aux découpes uniques, ce jeu invite les tout-petits à explorer la construction libre et l'équilibre.

Les couleurs vitaminées apportent une dimension visuelle joyeuse qui attire naturellement l'attention et stimule l'éveil sensoriel.

Découvrez différentes façons de jouer :
- Créer des tours et des structures d'équilibre
- Expérimenter avec les formes irrégulières
- Inventer des sculptures originales et créatives
- Développer la reconnaissance de motifs et de formes

Grâce à leurs formes irrégulières, ces pierres encouragent la réflexion, la concentration et la créativité. Cette liberté de manipulation nourrit l'autonomie progressive et renforce la confiance en soi lorsqu'ils parviennent à maintenir leurs structures en équilibre.

Pédagogie :
Parfaitement adapté pour les approches Montessori et Pikler, ce matériel s'intègre dans les espaces de jeu libre, les crèches, micro-crèches et établissements d'accueil du jeune enfant.

Caractéristiques :
- 20 pierres en bois de pin
- Formes uniques et variées pour chaque pièce
- Peinture à l'eau pour une sécurité maximale
- Design français
- Dimensions générales: 25 x 8 x 20 cm`,
        
        // Материалы
        ["Bois de pin", "Peinture à l'eau"],
        
        // Безопасность / нормы
        ["Conforme CE", "Conforme NF", "Garantie 2 ans"],
        
        // Возраст
        ["2 à 6 ans"],
        
        // Размеры
        "25 x 8 x 20 cm (grandes pierres: 12 x 2,5 x 6 cm, petites: 3,5 cm)",
        
        // Новая цена
        56.80,
        
        // Slug товара
        "pierres-empiler-sweet-cocoon"
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
