"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { PRODUCTS } from "@/lib/data/products";
import { formatPrice, cn } from "@/lib/utils";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] p-4 bg-navy/40 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-label="Recherche"
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-navy/5 px-5 py-4">
              <Search className="w-5 h-5 text-navy/40 shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Que cherchez-vous ? (peluche, train, cadeau…)"
                className="flex-1 h-10 bg-transparent text-navy placeholder:text-navy/40 focus:outline-none"
                aria-label="Rechercher un produit"
              />
              <button
                onClick={onClose}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full text-navy/60 hover:text-navy hover:bg-navy/5"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim() === "" ? (
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-3">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Peluche ours", "Train en bois", "Trottinette", "Cadeau 3 ans", "Puzzle"].map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-3 py-1.5 rounded-full bg-cream-soft text-navy text-sm hover:bg-coral hover:text-white transition-colors"
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-cream-soft mx-auto mb-4 inline-flex items-center justify-center">
                    <Search className="w-6 h-6 text-navy/30" />
                  </div>
                  <p className="font-display font-semibold text-navy">Aucun résultat</p>
                  <p className="text-sm text-navy/60 mt-1">
                    Essayez un autre mot-clé ou parcourez nos catégories.
                  </p>
                </div>
              ) : (
                <ul className="p-3">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/produit/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-cream-soft transition-colors"
                      >
                        <span
                          className={cn(
                            "w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0",
                            p.bgClass,
                          )}
                        >
                          {p.images[0]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-semibold text-navy line-clamp-1">
                            {p.name}
                          </p>
                          <p className="text-xs text-navy/60">{p.categoryName}</p>
                        </div>
                        <span className="font-display font-bold text-navy shrink-0">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
