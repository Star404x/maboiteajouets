import { Pool } from "pg";
import type { Product as TypeProduct } from "@/lib/types";

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
}

// Normalize DB row to proper types
function normalizeProduct(row: any): TypeProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as any,
    categoryName: row.categoryName,
    description: row.description,
    longDescription: row.longDescription,
    price: parseFloat(row.price),
    oldPrice: row.oldPrice ? parseFloat(row.oldPrice) : undefined,
    rating: row.rating ? parseFloat(row.rating) : 0,
    reviewCount: row.reviewCount || 0,
    age: row.age || [],
    images: row.images || [],
    badge: row.badge,
    inStock: row.inStock,
    stockCount: row.stockCount,
    materials: row.materials || [],
    dimensions: row.dimensions,
    safety: row.safety || [],
    color: row.color,
    bgClass: row.bgClass,
  };
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

export async function getProductsByCategory(category: string): Promise<TypeProduct[]> {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM products WHERE category = $1 ORDER BY id", [category]);
    return result.rows.map(normalizeProduct) as TypeProduct[];
  } finally {
    client.release();
  }
}

export async function getProductsByAge(age: string): Promise<TypeProduct[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM products WHERE $1 = ANY(age) ORDER BY id",
      [age]
    );
    return result.rows.map(normalizeProduct) as TypeProduct[];
  } finally {
    client.release();
  }
}
