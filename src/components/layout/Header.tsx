"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/store/cart";
import { CATEGORIES } from "@/lib/data/categories";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "@/components/search/SearchModal";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCart((s) => s.openCart);
  const itemCount = useCart((s) => s.getItemCount());
  const favCount = useCart((s) => s.favorites.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/85 backdrop-blur-xl shadow-soft border-b border-navy/5"
            : "bg-transparent",
        )}
      >
        <div className="container-wide">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              scrolled ? "h-16" : "h-20",
            )}
          >
            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
              {NAV.slice(0, 2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Categories mega-menu */}
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button
                  className="px-4 py-2 rounded-full text-sm font-semibold text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors inline-flex items-center gap-1"
                  aria-expanded={catOpen}
                  aria-haspopup="true"
                >
                  Catégories
                  <ChevronDown className={cn("w-4 h-4 transition-transform", catOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white rounded-3xl shadow-card border border-navy/5 p-6 grid grid-cols-3 gap-3"
                    >
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/categorie/${cat.slug}`}
                          className={cn(
                            "group flex items-center gap-3 p-3 rounded-2xl transition-all hover:scale-[1.02]",
                            cat.bgClass,
                          )}
                        >
                          <span className="text-3xl">{cat.icon}</span>
                          <div>
                            <div className="font-display font-semibold text-navy text-sm">
                              {cat.name}
                            </div>
                            <div className="text-xs text-navy/60 line-clamp-1">
                              {cat.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {NAV.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="h-11 w-11 inline-flex items-center justify-center rounded-full text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/compte"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-full text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                aria-label="Mon compte"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/favoris"
                className="relative h-11 w-11 hidden sm:inline-flex items-center justify-center rounded-full text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                aria-label={`Favoris (${favCount})`}
              >
                <Heart className="w-5 h-5" />
                {favCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative h-11 w-11 inline-flex items-center justify-center rounded-full text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                aria-label={`Panier (${itemCount} articles)`}
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-coral text-white text-[11px] font-bold flex items-center justify-center shadow-pop"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden h-11 w-11 inline-flex items-center justify-center rounded-full text-navy/80 hover:text-coral hover:bg-coral/5 transition-colors"
                aria-label="Ouvrir le menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
