"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Hero — самая эмоциональная секция.
 * 3D-композиция построена из emoji + декоративных SVG форм.
 * ЗАМЕНИТЬ на настоящий 3D-render когда будет готов
 * (см. PLACEHOLDER_IMAGES.md — prompt для генерации).
 */
export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-8 pb-20 lg:pt-16 lg:pb-32">
      {/* Subtle background decorations — positioned to not interfere */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {/* Stars and sparkles - below content z-index */}
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-[8%] text-2xl opacity-40"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 right-[5%] text-xl opacity-30"
        >
          ✨
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[12%] text-3xl opacity-50"
        >
          ⭐
        </motion.div>
      </div>

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text column */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur shadow-soft border border-white/50 mb-6"
            >
              <Sparkles className="w-4 h-4 text-coral" />
              <span className="text-sm font-semibold text-navy">
                Nouvelle collection · Livraison offerte dès 49&nbsp;€
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-navy text-display-lg md:text-display-xl lg:text-display-2xl text-balance"
            >
              Le bonheur <br className="hidden sm:inline" />
              commence <span className="text-coral relative inline-block">
                ici
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-coral rounded-full origin-left"
                  aria-hidden
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-navy/70 max-w-xl mx-auto lg:mx-0 text-balance"
            >
              Des jouets pour apprendre, jouer et grandir en s'amusant !
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start items-center"
            >
              <Button asChild size="lg" className="shadow-md hover:shadow-lg">
                <Link href="/boutique">
                  Découvrir la collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-coral text-coral hover:bg-coral hover:text-white transition-colors shadow-sm">
                <Link href="/nouveautes">
                  Voir les nouveautés
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Mini trust bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-navy/60"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-sunflower">★★★★★</span>
                <span>4.9/5 · 2 500 avis</span>
              </span>
              <span>🌱 Éco-responsable</span>
              <span>🇫🇷 Livré depuis la France</span>
            </motion.div>
          </div>

          {/* 3D-Illustration column */}
          <HeroIllustration reduce={!!reduce} />
        </div>
      </div>
    </section>
  );
}

function HeroIllustration({ reduce }: { reduce: boolean }) {
  return (
    <div className="relative w-full h-[500px] hidden lg:block">
      {/* Soft glow background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-coral/5 via-transparent to-mint/5 blur-3xl" />



      {/* Floating toys — well-contained, balanced */}
      {/* Teddy bear — top left */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -16, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-8 text-5xl drop-shadow-lg"
      >
        🧸
      </motion.div>

      {/* Bunny — top right */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -20, 0], rotate: [4, -4, 4] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-12 right-12 text-4xl drop-shadow-lg"
      >
        🐰
      </motion.div>

      {/* Rocket — upper right */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -18, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute top-56 right-8 text-4xl drop-shadow-lg"
      >
        🚀
      </motion.div>

      {/* Dinosaur — lower left */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute bottom-24 left-16 text-3xl drop-shadow-lg"
      >
        🦕
      </motion.div>

      {/* Puzzle — center-left */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-1/2 left-40 text-3xl drop-shadow-lg"
      >
        🧩
      </motion.div>

      {/* Palette — bottom right */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0], rotate: [6, -6, 6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-40 right-24 text-2xl drop-shadow-lg"
      >
        🎨
      </motion.div>

      {/* ✨ Stars & sparkles — decorative accents, subtle */}
      {/* Top left star */}
      <motion.div
        animate={reduce ? undefined : { rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-8 left-32 text-2xl opacity-60"
      >
        ⭐
      </motion.div>

      {/* Center-top sparkle */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-1/2 text-xl text-sunflower opacity-70"
      >
        ✨
      </motion.div>

      {/* Right side star */}
      <motion.div
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 right-16 text-xl opacity-50"
      >
        ⭐
      </motion.div>

      {/* Bottom sparkle */}
      <motion.div
        animate={reduce ? undefined : { y: [0, 10, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-1/3 text-lg text-coral opacity-60"
      >
        ✨
      </motion.div>
    </div>
  );
}
