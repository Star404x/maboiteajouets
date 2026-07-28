import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Pool } from "pg";
// Removed DB imports - using static PRODUCTS data for SSG
import { PRODUCTS } from "@/lib/data/products";
import { REVIEWS } from "@/lib/data/reviews";

// ISR: Revalidate every 10 seconds (Railway CDN respects Next.js ISR)
// Use /api/revalidate for on-demand invalidation
export const revalidate = 10;
import type { Review } from "@/lib/types";
import { headers } from "next/headers";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // Use PRODUCTS data (available at build time) instead of DB query
  // This avoids database connection errors during static generation
  const p = PRODUCTS.find((prod) => prod.slug === slug);
  if (!p) return { title: "Produit introuvable" };

  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: {
      title: `${p.name} · ${p.price.toFixed(2)} €`,
      description: p.description,
      type: "website",
    },
  };
}

// Fetch fresh product data from DB if available
async function getProductFromDB(slug: string) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) return null;
    
    const pool = new Pool({ connectionString: dbUrl, max: 1 });
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        "SELECT * FROM products WHERE slug = $1",
        [slug]
      );
      
      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } finally {
      client.release();
      pool.end();
    }
  } catch (e) {
    // Fall back to static data on DB error
    console.warn("[ProductPage] DB fetch failed, using static data");
  }
  return null;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Try to fetch fresh product data from DB (ISR revalidates every 60s)
  let dbProduct = await getProductFromDB(slug);
  
  // Fall back to static PRODUCTS data
  let product = PRODUCTS.find((prod) => prod.slug === slug);
  if (!product) notFound();
  
  // If DB product exists, update price from DB
  if (dbProduct) {
    product = { ...product, price: parseFloat(dbProduct.price) };
    if (dbProduct.reviewcount) {
      product = { ...product, reviewCount: dbProduct.reviewcount };
    }
  }

  // Load reviews for this product at build-time
  const productNum = product.id.replace('p-', '');
  const productReviews: Review[] = REVIEWS.filter((r) =>
    r.id.startsWith(`r-${productNum}`)
  );
  
  console.log(`[BUILD] Product: ${product.id}, Reviews found: ${productReviews.length}`);
  
  // Update product with actual review count from embedded data
  product = { ...product, reviewCount: productReviews.length };

  // Get related products from PRODUCTS list instead of DB
  const allRelated = PRODUCTS.filter((p) => p.category === product.category);
  const related = allRelated.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="container-wide py-8 lg:py-14 pb-32 lg:pb-14">
      <Breadcrumbs
        items={[
          { label: "Boutique", href: "/boutique" },
          { label: product.categoryName, href: `/categorie/${product.category}` },
          { label: product.name },
        ]}
      />

      <ProductDetail product={product} />

      {/* Customer Reviews - ALWAYS render for build-time embedding */}
      <div className="mt-16 lg:mt-24">
        <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-8">
          Avis clients ({productReviews.length})
        </h2>
        <div className="space-y-6">
          {productReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-2xl bg-cream-soft border border-navy/5 hover:border-navy/10 transition-colors"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy flex-shrink-0 ${review.avatarColor || 'bg-blue-100'}`}
                  >
                    {review.author[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-navy">{review.author}</p>
                        <p className="text-xs text-navy/60">{review.date}</p>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i <= review.rating
                                ? 'fill-sunflower text-sunflower'
                                : 'fill-navy/10 text-navy/20'
                            }`}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-navy/80 leading-relaxed">{review.content}</p>
              </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 lg:mt-28">
          <h2 className="font-display font-bold text-navy text-display-md mb-8">
            Vous pourriez aussi <span className="text-coral">aimer</span>
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
