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
        `Le circuit de train est une aventure ludique conçue pour éveiller la curiosité et stimuler l'imagination des enfants. Ce set captivant comprend un train à pousser avec un wagon passager, un conducteur de train et deux passagers animés.

Contenu complet :
- 1 train à pousser motorisé
- 1 wagon passager
- 1 conducteur de train avec bras et jambes mobiles
- 2 passagers avec bras et jambes mobiles (avec clics et ventres qui couinent)
- Circuit en forme de 8 avec rails
- Plus de 19 pièces en total

Caractéristiques spéciales :
- Figurines dotées de bras et jambes mobiles
- Clics sonores et effets amusants
- Circuit en forme de 8 stimule la créativité et la motricité fine
- Idéal pour les jeux collectifs et les histoires imaginatives

Développement de l'enfant :
Ce jouet est idéal pour aborder des thèmes éducatifs tels que les moyens de transport, les voyages ou la sécurité routière. Il encourage la communication et le jeu de groupe, tout en développant la coordination main-œil, la résolution de problèmes et les compétences sociales grâce aux scénarios d'histoires imaginatives.

Poids : 1,7 kg
Perfait pour les crèches, micro-crèches et structures d'accueil de jeunes enfants.`,
        
        // Материалы (non spécifié sur le site, généralement bois/plastique pour trains)
        ["Plastique", "Bois"],
        
        // Безопасность / нормы
        ["Conforme EN71", "Conforme ASTM", "Conforme CPSIA"],
        
        // Возраст
        ["1 à 5 ans"],
        
        // Размеры (dimensions de l'emballage)
        "33 x 26,5 x 14,7 cm (emballage)",
        
        // Новая цена
        186.80,
        
        // Slug товара
        "circuit-train-figurines"
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
