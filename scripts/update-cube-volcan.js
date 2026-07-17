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
        `Imaginez un volcan coloré, orné d'adorables illustrations de dinosaures, prêt à stimuler la curiosité de votre enfant. Ce cube Dino est une invitation à l'exploration, avec des activités captivantes à chaque coin.

Ce volcan multi-activités offre des expériences sensorielles variées :

À l'avant : Boîte à formes avec dinosaures (Tyrannosaures, Tricératops, Ptéranodons) à encastrer dans les formes correspondantes. Les pièces tombent doucement grâce à la feutrine au fond de la boîte, sans faire de bruit, ce qui permet à votre enfant de les récupérer facilement par la grande ouverture sur le côté.

À l'arrière : Trois engrenages à tourner pour développer la motricité fine et la coordination.

Côté gauche : Un miroir pour stimuler la découverte de soi.

Sur le dessus : Un labyrinthe captivant et un boulier avec 8 jolies perles en bois.

Ce cube de jeux est facilement transportable et spécialement conçu pour les petits explorateurs du monde des dinosaures. Chaque activité développe la curiosité, la motricité et la concentration de votre enfant.`,
        
        // Материалы
        ["Bois FSC®", "Métal", "Feutrine"],
        
        // Безопасность / нормы
        ["Conforme CE", "Conforme NF", "Garantie 2 ans"],
        
        // Возраст
        ["12 mois et +"],
        
        // Размеры
        "16,8 x 16,2 x 21 cm",
        
        // Новая цена
        49.80,
        
        // Slug товара
        "cube-volcan-activites"
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
