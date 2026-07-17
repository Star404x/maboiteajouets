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
        `Le camion de pompier Tolo et ses deux figurines sont spécialement conçus pour encourager le jeu d'imitation et la mise en situation d'urgence dès le plus jeune âge. Ce jouet robuste est idéal pour initier les enfants aux premiers gestes de solidarité et de sauvetage, tout en stimulant leur imagination.

Contenu complet :
- 1 camion de pompier robuste et coloré
- 2 figurines articulées de pompiers
- Dimensions : 20 cm (L) x 16 cm (H)
- Facilement transportable et manipulable

Caractéristiques de qualité :
Fabriqué en plastique de haute qualité, le camion de pompier est adapté à une utilisation intensive en crèche, micro-crèche, halte-garderie ou tout établissement d'accueil du jeune enfant. Les deux figurines incluses sont ergonomiques et facilement manipulables par les petites mains.

Bénéfices pédagogiques :
- Favorise le jeu à plusieurs et encourage les interactions sociales
- Stimule la communication et les compétences langagières
- Développe l'empathie et la conscience sociale
- Encourage les jeux de rôle enrichissants
- Initie aux concepts de sauvetage et de solidarité

Avantages pratiques :
- Jouets Tolo conçus pour résister aux usages collectifs fréquents
- Facilement lavables et durables
- Design coloré et attrayant qui captive l'attention des tout-petits
- Nettoyage facile pour les professionnels de la petite enfance
- Sûrs et conformes aux normes strictes`,
        
        // Материалы
        ["Plastique de haute qualité"],
        
        // Безопасность / нормы
        ["Conforme EN71", "Garantie 1 an"],
        
        // Возраст
        ["Dès 12 mois"],
        
        // Размеры
        "20 x 16 cm (camion)",
        
        // Новая цена
        75.80,
        
        // Slug товара
        "camion-pompier-figurines"
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
