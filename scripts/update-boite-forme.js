const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateProduct() {
  const client = await pool.connect();
  try {
    // Обновляем товар Boite à forme en bois с полной информацией с Papouille
    const result = await client.query(
      `UPDATE products SET 
        description = $2,
        longDescription = $3,
        materials = $4,
        dimensions = $5,
        safety = $6,
        badge = $7,
        age = $8
       WHERE id = $1
       RETURNING id, name`,
      [
        "p-034", // ID товара
        "La Boîte à Formes Goki : Un outil ludique pour l'éveil des jeunes enfants. Jouet éducatif essentiel pour le développement de la motricité fine des jeunes enfants, que ce soit en crèche ou à la maison.",
        `La Boîte à Formes de Goki offre une opportunité amusante et interactive pour les enfants de découvrir les couleurs et les formes, contribuant ainsi à leur épanouissement global.

Caractéristiques techniques :
- Dimensions pratiques : 16 x 16 x 10 cm, parfaitement adaptée aux petites mains
- Diversité des pièces : Inclut 10 pièces à encastrer, offrant une variété de formes pour stimuler la reconnaissance et la coordination
- Matériau durable : Fabriquée en bois, elle est à la fois robuste et sûre pour les enfants
- Poids idéal : 0,87 kg, ce qui la rend stable et facile à manipuler pour les tout-petits

Engagement de Goki :
- Designs enfantins et astucieux : Des jouets conçus avec des motifs attrayants et adaptés à l'âge des enfants
- Sécurité garantie : Utilisation de peintures à base d'eau non toxiques, assurant un environnement de jeu sûr
- Contrôle qualité rigoureux : Des tests continus en laboratoire interne et par des instituts indépendants certifiés

Recommandée pour les enfants de 12 mois et plus, cette boîte à formes est un excellent outil pour encourager l'apprentissage précoce des formes et des couleurs.`,
        ["Bois", "Peintures à base d'eau non toxiques"],
        "16 x 16 x 10 cm (Poids: 0,87 kg, 10 pièces à encastrer)",
        ["Certifié CE", "BPA Free", "Peintures non toxiques", "Tests en laboratoire certifié"],
        null, // Убираем "Nouveau" badge, так как это товар из реального каталога
        ["0-12m", "1-3"] // Возраст от 12 месяцев и выше
      ]
    );

    console.log("✅ Товар обновлен:", result.rows[0]);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProduct().catch(console.error);
