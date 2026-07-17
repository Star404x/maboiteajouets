import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { PRODUCTS } from "@/lib/data/products";
import { REVIEWS } from "@/lib/data/reviews";
import type { Review } from "@/lib/types";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

export function generateStaticParams() {
  // Keep static generation for known products
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

      <ProductDetail product={product} reviews={productReviews} />

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
    </div>
  );
}
