"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export function CategoriesStrip() {
  return (
    <section className="container-wide py-16 lg:py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
            Explorer
          </p>
          <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
            Nos <span className="text-coral">catégories</span>
          </h2>
        </div>
        <Link
          href="/boutique"
          className="text-navy font-semibold hover:text-coral transition-colors self-start md:self-auto"
        >
          Voir toute la boutique →
        </Link>
      </div>

      {/* Grid on desktop, horizontal swipe on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <Link
              href={`/categorie/${cat.slug}`}
              className={cn(
                "group relative flex flex-col items-center gap-3 p-6 rounded-3xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500",
                cat.bgClass,
              )}
            >
              {/* Decorative circle */}
              <span className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/40 blur-xl" />

              <span className="relative text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                {cat.icon}
              </span>
              <span className="relative font-display font-semibold text-navy text-sm md:text-base text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
