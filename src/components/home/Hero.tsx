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
      {/* Decorative background — clouds & stars */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={reduce ? undefined : { x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-[6%] text-[80px] opacity-70"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-[10%] text-6xl opacity-50"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-[20%] text-4xl"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 left-[15%] text-3xl opacity-60"
        >
          ✨
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-24 right-[8%] text-3xl opacity-70"
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
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M0 4 Q 25 0 50 4 T 100 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="text-coral/60"
                  />
                </svg>
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
              className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Button asChild size="lg">
                <Link href="/boutique">
                  Découvrir la collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/nouveautes">Voir les nouveautés</Link>
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative aspect-square max-w-[560px] mx-auto lg:mx-0 lg:ml-auto"
    >
      {/* Sun glow behind box */}
      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-sunflower/30 via-coral/20 to-transparent blur-3xl" />

      {/* Big cardboard box */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 bottom-0 flex items-end justify-center"
      >
        <div className="relative w-[75%] h-[65%] mb-4">
          {/* Box body */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8B575] to-[#C68F52] rounded-[2rem] shadow-card" />
          {/* Front flap darker */}
          <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-b from-[#C68F52] to-[#A8783F] rounded-b-[2rem]" />
          {/* Highlight */}
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-transparent via-white/10 to-white/30" />

          {/* Logo on box */}
          <div className="absolute inset-x-0 top-[45%] flex flex-col items-center gap-1 text-white">
            <span className="text-2xl">★</span>
            <span className="font-display font-bold text-lg">Ma Boîte</span>
            <span className="font-display font-semibold text-xs opacity-90">à Jouets</span>
          </div>

          {/* Open flaps at top */}
          <div className="absolute -top-6 left-0 w-1/2 h-14 bg-gradient-to-br from-[#E8B575] to-[#D4A25E] rounded-tl-[2rem] origin-bottom-right -rotate-[25deg] shadow-soft" />
          <div className="absolute -top-6 right-0 w-1/2 h-14 bg-gradient-to-bl from-[#E8B575] to-[#D4A25E] rounded-tr-[2rem] origin-bottom-left rotate-[25deg] shadow-soft" />
        </div>
      </motion.div>

      {/* Floating toys — layered */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0], rotate: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[8%] left-[20%] text-[6rem] drop-shadow-2xl"
      >
        🧸
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -18, 0], rotate: [3, -3, 3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-[6%] right-[18%] text-[5rem] drop-shadow-2xl"
      >
        🐰
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute top-[26%] right-[6%] text-[4.5rem] drop-shadow-xl"
      >
        🦕
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -22, 0], rotate: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        className="absolute top-[18%] left-[6%] text-[4rem] drop-shadow-xl"
      >
        🚀
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute top-[38%] left-[35%] text-[3.5rem] drop-shadow-lg"
      >
        🧩
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { y: [0, -12, 0], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[42%] right-[28%] text-[3rem] drop-shadow-lg"
      >
        🎨
      </motion.div>

      {/* Sparkles */}
      <motion.div
        animate={reduce ? undefined : { rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[12%] right-[38%] text-3xl text-sunflower"
      >
        ✨
      </motion.div>
      <motion.div
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[30%] left-[8%] text-2xl"
      >
        ⭐
      </motion.div>
    </motion.div>
  );
}
