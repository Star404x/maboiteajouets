import { PRODUCTS } from "@/lib/data/products";
import { ProductSlider } from "@/components/product/ProductSlider";
import Link from "next/link";

export function NewProductsSlider() {
  // Prend les 8 derniers ajoutés
  const products = [...PRODUCTS].reverse().slice(0, 8);

  return (
    <section className="container-wide py-16 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
            Fraîchement arrivés
          </p>
          <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg">
            <span className="text-coral">Nouveautés</span>
          </h2>
        </div>
        <Link href="/nouveautes" className="text-navy font-semibold hover:text-coral transition-colors">
          Toutes les nouveautés →
        </Link>
      </div>

      <ProductSlider products={products} />
    </section>
  );
}
