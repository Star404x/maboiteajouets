import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, getRelatedProducts } from "@/lib/data/products";
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
  const p = getProduct(slug);
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
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug, product.category);

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
