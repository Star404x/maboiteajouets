/**
 * 🔴 AUDIT NOTE: Brand names listed below are placeholder.
 * Before publication, either:
 * 1. Verify you have usage rights (partnership agreements, licenses)
 * 2. Remove this section entirely if not authorized
 * 3. Replace with actual partner logos and links
 * 
 * ⚠️ DO NOT PUBLISH without legal confirmation.
 */

const BRANDS = ["LEGO", "Playmobil", "VTech", "Smoby", "Janod", "Fisher-Price"];

export function BrandsStrip() {
  return (
    <section className="container-wide py-16 lg:py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          Partenaires
        </p>
        <h2 className="font-display font-bold text-navy text-display-sm md:text-display-md">
          Des marques de confiance
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {BRANDS.map((brand) => (
          <div
            key={brand}
            className="px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-white border border-navy/5 shadow-soft hover:shadow-card hover:border-coral/30 transition-all cursor-pointer"
          >
            <span className="font-display font-bold text-navy text-lg md:text-xl">
              {brand}
            </span>
          </div>
        ))}
      </div>


    </section>
  );
}
