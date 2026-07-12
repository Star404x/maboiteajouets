import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/data/categories";
import { getProductsByCategory as getProductsByCategoryDB } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "Catégorie introuvable" };

  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/categorie/${cat.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = await getProductsByCategoryDB(slug);

  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Boutique", href: "/boutique" },
          { label: category.name },
        ]}
      />

      <div className={`rounded-4xl ${category.bgClass} py-14 lg:py-20 mb-10 relative overflow-hidden`}>
        <div aria-hidden className="absolute -top-6 -right-6 text-[180px] opacity-30 rotate-12">
          {category.icon}
        </div>
        <div className="text-center max-w-2xl mx-auto relative">
          <span className="inline-block text-6xl mb-4">{category.icon}</span>
          <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
            {category.name}
          </h1>
          <p className="mt-3 text-navy/70 text-lg">{category.description}</p>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-navy/70">
              <span className="font-bold text-navy">{products.length}</span>{" "}
              produit{products.length > 1 ? "s" : ""}
            </p>
          </div>
          <ProductGrid products={products} />
        </>
      ) : (
        <p className="text-center py-20 text-navy/60">
          Aucun produit disponible dans cette catégorie pour le moment.
        </p>
      )}
    </div>
  );
}
