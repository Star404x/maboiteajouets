import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { PRODUCTS } from "@/lib/data/products";
import { REVIEWS } from "@/lib/data/reviews";
import type { Review } from "@/lib/types";
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
  const p = await getProductBySlug(slug);
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

function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 lg:mt-24">
      <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-8">
        Avis clients ({reviews.length})
      </h2>
      <div className="space-y-6">
        {reviews.map((review) => (
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
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Load reviews for this product at build-time
  const productNum = product.id.replace('p-', '');
  const productReviews: Review[] = REVIEWS.filter((r) =>
    r.id.startsWith(`r-${productNum}`)
  );
  
  // Update product with actual review count
  product.reviewCount = productReviews.length;

  const allRelated = await getProductsByCategory(product.category);
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

      {/* Reviews Section */}
      <ReviewsSection reviews={productReviews} />

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
