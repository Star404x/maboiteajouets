"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Heart, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CATEGORIES } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "Promotions", href: "/promotions" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[60]"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-cream z-[70] shadow-card flex flex-col"
            role="dialog"
            aria-label="Menu mobile"
          >
            <div className="flex items-center justify-between p-5 border-b border-navy/5">
              <Logo />
              <button
                onClick={onClose}
                className="h-10 w-10 inline-flex items-center justify-center rounded-full text-navy hover:bg-navy/5"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <nav className="flex flex-col gap-1 mb-6" aria-label="Navigation mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="px-4 py-3 rounded-2xl font-display font-semibold text-navy hover:bg-coral/5 hover:text-coral transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mb-6">
                <h3 className="px-4 mb-3 text-xs font-bold uppercase tracking-wider text-navy/50">
                  Catégories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categorie/${cat.slug}`}
                      onClick={onClose}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl",
                        cat.bgClass,
                      )}
                    >
                      <span className="text-3xl">{cat.icon}</span>
                      <span className="font-display font-semibold text-sm text-navy text-center leading-tight">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-navy/5 pt-5 flex flex-col gap-1">
                <Link
                  href="/compte"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-navy hover:bg-navy/5 font-semibold"
                >
                  <User className="w-5 h-5" />
                  Mon compte
                </Link>
                <Link
                  href="/favoris"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-navy hover:bg-navy/5 font-semibold"
                >
                  <Heart className="w-5 h-5" />
                  Mes favoris
                </Link>
                <Link
                  href="/panier"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-navy hover:bg-navy/5 font-semibold"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Mon panier
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
