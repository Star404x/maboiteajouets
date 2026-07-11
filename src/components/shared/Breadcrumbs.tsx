import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Fil d'Ariane" className="flex items-center flex-wrap gap-1.5 text-sm text-navy/60 mb-6">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-coral">
          <Home className="w-3.5 h-3.5" />
          <span className="sr-only">Accueil</span>
        </Link>
        {items.map((crumb, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-navy/30" />
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-coral">
                {crumb.label}
              </Link>
            ) : (
              <span className="font-semibold text-navy">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://maboiteajouets.fr",
              },
              ...items.map((c, i) => ({
                "@type": "ListItem",
                position: i + 2,
                name: c.label,
                ...(c.href ? { item: `https://maboiteajouets.fr${c.href}` } : {}),
              })),
            ],
          }),
        }}
      />
    </>
  );
}
