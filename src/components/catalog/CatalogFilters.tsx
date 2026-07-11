"use client";

import { useMemo, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { CATEGORIES } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export interface Filters {
  category?: string;
  age?: string;
  priceMax?: number;
  onlyPromo: boolean;
  sort: "recommended" | "price-asc" | "price-desc" | "rating";
}

const AGE_OPTIONS = [
  { value: "0-12m", label: "0-12 mois" },
  { value: "1-3", label: "1-3 ans" },
  { value: "3-5", label: "3-5 ans" },
  { value: "6-8", label: "6-8 ans" },
  { value: "9+", label: "9+ ans" },
];

const SORT_OPTIONS: Array<{ value: Filters["sort"]; label: string }> = [
  { value: "recommended", label: "Recommandés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Meilleures notes" },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  total: number;
}

export function CatalogFilters({ filters, onChange, total }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const reset = () =>
    onChange({ category: undefined, age: undefined, priceMax: undefined, onlyPromo: false, sort: "recommended" });

  const activeCount = useMemo(
    () =>
      [filters.category, filters.age, filters.priceMax, filters.onlyPromo ? "promo" : undefined].filter(
        Boolean,
      ).length,
    [filters],
  );

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white shadow-soft text-navy font-semibold text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeCount > 0 && (
            <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-coral text-white text-xs inline-flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
          className="h-11 rounded-full px-4 bg-white shadow-soft text-navy font-semibold text-sm border-0 focus:outline-none focus:ring-2 focus:ring-coral/30"
          aria-label="Trier"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Sidebar — desktop always, mobile drawer */}
      <aside
        className={cn(
          "lg:sticky lg:top-24 h-fit",
          "fixed lg:relative inset-0 lg:inset-auto z-[70] lg:z-auto",
          mobileOpen ? "block" : "hidden lg:block",
        )}
      >
        {/* Mobile backdrop */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-navy/40 backdrop-blur-sm z-0"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="relative lg:static bg-white lg:bg-transparent h-full lg:h-auto w-[85%] max-w-[380px] lg:w-full lg:max-w-none ml-auto lg:m-0 overflow-y-auto lg:overflow-visible p-6 lg:p-0 z-10">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-navy text-xl">Filtres</h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="h-10 w-10 rounded-full inline-flex items-center justify-center text-navy hover:bg-navy/5"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sort — desktop */}
          <div className="hidden lg:block mb-6">
            <h3 className="font-display font-bold text-navy text-sm mb-3">Trier par</h3>
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value as Filters["sort"] })}
              className="w-full h-11 rounded-2xl px-4 bg-white border border-navy/10 text-navy text-sm focus:outline-none focus:border-coral"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-display font-bold text-navy text-sm mb-3">Catégories</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => onChange({ ...filters, category: undefined })}
                className={cn(
                  "text-left px-3 py-2 rounded-xl text-sm transition-colors",
                  !filters.category ? "bg-coral/10 text-coral font-semibold" : "text-navy/70 hover:bg-navy/5",
                )}
              >
                Toutes les catégories
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => onChange({ ...filters, category: c.slug })}
                  className={cn(
                    "text-left px-3 py-2 rounded-xl text-sm transition-colors inline-flex items-center gap-2",
                    filters.category === c.slug
                      ? "bg-coral/10 text-coral font-semibold"
                      : "text-navy/70 hover:bg-navy/5",
                  )}
                >
                  <span>{c.icon}</span>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div className="mb-6">
            <h3 className="font-display font-bold text-navy text-sm mb-3">Âge</h3>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  onClick={() =>
                    onChange({ ...filters, age: filters.age === a.value ? undefined : a.value })
                  }
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    filters.age === a.value
                      ? "bg-navy text-white"
                      : "bg-white border border-navy/10 text-navy hover:border-coral",
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h3 className="font-display font-bold text-navy text-sm mb-3">Prix maximum</h3>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={filters.priceMax ?? 200}
              onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full accent-coral"
            />
            <div className="flex items-center justify-between text-xs text-navy/60 mt-1">
              <span>10 €</span>
              <span className="font-semibold text-navy">{filters.priceMax ?? 200} € max</span>
              <span>200 €</span>
            </div>
          </div>

          {/* Promo toggle */}
          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlyPromo}
              onChange={(e) => onChange({ ...filters, onlyPromo: e.target.checked })}
              className="w-5 h-5 rounded accent-coral"
            />
            <span className="text-sm text-navy font-semibold">
              Uniquement en promotion
            </span>
          </label>

          {activeCount > 0 && (
            <button
              onClick={reset}
              className="w-full h-11 rounded-full border-2 border-navy/10 text-navy font-semibold text-sm hover:border-coral hover:text-coral transition-colors"
            >
              Réinitialiser les filtres
            </button>
          )}

          <p className="mt-4 text-center text-xs text-navy/60">
            {total} produit{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>
        </div>
      </aside>
    </>
  );
}
