import { Pool } from "pg";
import type { Product as TypeProduct } from "@/lib/types";
import { REVIEWS } from "@/lib/data/reviews";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Raw DB product type (strings only)
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  description: string;
  longDescription?: string;
  price: string; // stored as DECIMAL
  oldPrice?: string;
  rating?: string;
  reviewCount?: number;
  age: string[];
  images: string[];
  badge?: string;
  inStock: boolean;
  stockCount: number;
  materials: string[];
  dimensions?: string;
  safety?: string[];
  color?: string;
  bgClass?: string;
  stripelink?: string;
}

// Normalize DB row to proper types
function normalizeProduct(row: any): TypeProduct {
  const product: TypeProduct = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as any,
    categoryName: row.categoryname || row.categoryName,
    description: row.description,
    longDescription: row.longdescription || row.longDescription,
    price: parseFloat(row.price),
    oldPrice: row.oldprice ? parseFloat(row.oldprice) : undefined,
    rating: row.rating ? parseFloat(row.rating) : 0,
    reviewCount: row.reviewcount || row.reviewCount || 0,
    age: row.age || [],
    images: row.images || [],
    badge: row.badge,
    inStock: row.instock !== undefined ? row.instock : row.inStock,
    stockCount: row.stockcount || row.stockCount || 0,
    materials: row.materials || [],
    dimensions: row.dimensions,
    safety: row.safety || [],
    color: row.color,
    bgClass: row.bgclass || row.bgClass,
  };
  
  // Add stripeLink if it exists (handle both camelCase and lowercase from DB)
  if (row.stripeLink) product.stripeLink = row.stripeLink;
  else if (row.stripelink) product.stripeLink = row.stripelink;
  
  return product;
}

export async function getProducts(): Promise<TypeProduct[]> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM products ORDER BY id");
    return result.rows.map(normalizeProduct) as TypeProduct[];
  } finally {
    client.release();
  }
}

export async function getProductBySlug(slug: string): Promise<TypeProduct | null> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM products WHERE slug = $1", [slug]);
    const row = result.rows[0];
    return (row ? normalizeProduct(row) : null) as TypeProduct | null;
  } finally {
    client.release();
  }
}

// Enrich products with actual review counts from REVIEWS data
function enrichProductsWithReviews(products: TypeProduct[]): TypeProduct[] {
  return products.map((product) => {
    const productNum = product.id.replace('p-', '');
    const reviewCount = REVIEWS.filter((r) => r.id.startsWith(`r-${productNum}`)).length;
    return { ...product, reviewCount };
  });
}

export async function getProductsByCategory(category: string): Promise<TypeProduct[]> {
  // Use local products data instead of DB for better build-time performance
  const { PRODUCTS } = await import("./data/products");
  return PRODUCTS.filter((p) => p.category === category);
}

export async function getProductsByAge(age: string): Promise<TypeProduct[]> {
  // Use local products data instead of DB for better build-time performance
  const { PRODUCTS } = await import("./data/products");
  return PRODUCTS.filter((p) => p.age.includes(age as never));
}
