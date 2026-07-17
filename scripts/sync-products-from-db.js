const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function syncProducts() {
  const client = await pool.connect();
  try {
    console.log("✅ Connected to database, syncing products...");
    // Загружаем все товары из БД
    const result = await client.query(
      `SELECT id, slug, name, category, categoryName, description, longDescription, 
              price, oldPrice, rating, reviewCount, age, images, badge, inStock, 
              stockCount, materials, dimensions, safety, color, bgClass, stripelink 
       FROM products ORDER BY id`
    );

    const products = result.rows.map((row) => {
      const colors = {
        "jouets-bebe": "sky",
        "jouets-educatifs": "mint",
        "vehicules": "amber",
        "jeux-de-construction": "orange",
        "jeux-exterieur": "rose",
        "tapis-bebe": "pink",
        "peluches": "coral",
      };

      const bgClasses = {
        "jouets-bebe": "bg-[#F0F7FE]",
        "jouets-educatifs": "bg-[#E4F7F5]",
        "vehicules": "bg-gradient-to-br from-amber-100 to-amber-50",
        "jeux-de-construction": "bg-gradient-to-br from-orange-100 to-orange-50",
        "jeux-exterieur": "bg-gradient-to-br from-rose-100 to-rose-50",
        "tapis-bebe": "bg-gradient-to-br from-pink-100 to-pink-50",
        "peluches": "bg-pinkwash",
      };

      const colorMap = {
        "jouets-bebe": "sky",
        "jouets-educatifs": "mint",
        "vehicules": "amber",
        "jeux-de-construction": "orange",
        "jeux-exterieur": "rose",
        "tapis-bebe": "pink",
        "peluches": "coral",
      };

      const obj = {
        id: row.id,
        slug: row.slug,
        name: row.name,
        category: row.category,
        categoryName: row.categoryName || row.category,
        description: row.description,
        price: parseFloat(row.price),
        rating: row.rating ? parseFloat(row.rating) : 4.8,
        reviewCount: row.reviewCount || 0,
        age: row.age || [],
        images: row.images || [],
        inStock: row.inStock !== false,
        stockCount: row.stockCount || 0,
        materials: row.materials || [],
        safety: row.safety || [],
        color: row.color || colorMap[row.category] || "sky",
        bgClass: row.bgClass || bgClasses[row.category] || "bg-[#F0F7FE]",
      };

      // Optional fields - только если есть значение
      if (row.longDescription) obj.longDescription = row.longDescription;
      if (row.oldPrice) obj.oldPrice = parseFloat(row.oldPrice);
      if (row.badge) obj.badge = row.badge;
      if (row.dimensions) obj.dimensions = row.dimensions;
      if (row.color) obj.color = row.color;
      if (row.stripelink) obj.stripeLink = row.stripelink;

      return obj;
    });

    // Генерируем TypeScript файл
    const productsFile = path.join(__dirname, "../src/lib/data/products.ts");
    const jsonStr = JSON.stringify(products, null, 2);
    
    const content = `import type { Product } from "@/lib/types";

/**
 * Синхронизировано из БД: ${new Date().toISOString()}
 * Всего товаров: ${products.length}
 */
export const PRODUCTS: Product[] = ${jsonStr};

// Helpers
export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getNewProducts(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "Nouveau" || p.badge === "Coup de cœur");
}

export function getPromoProducts(): Product[] {
  return PRODUCTS.filter((p) => p.oldPrice && p.oldPrice > p.price);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "Meilleure vente");
}

export function getFeaturedProducts(count = 6): Product[] {
  return PRODUCTS.slice(0, count);
}

export function getRelatedProducts(currentSlug: string, category: string, count = 4): Product[] {
  return PRODUCTS.filter((p) => p.category === category && p.slug !== currentSlug).slice(0, count);
}

export function getProductsByAge(age: string): Product[] {
  return PRODUCTS.filter((p) => p.age.includes(age as never));
}
`;

    fs.writeFileSync(productsFile, content, "utf-8");
    console.log(`✅ Синхронизировано ${products.length} товаров в products.ts`);
  } finally {
    client.release();
    await pool.end();
  }
}

syncProducts().catch((err) => {
  console.warn("⚠️ Failed to sync from DB, using existing products.ts");
  console.warn(err.message);
  // Don't throw - let build continue with existing products.ts
  process.exit(0);
});
