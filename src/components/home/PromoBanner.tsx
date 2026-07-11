"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  const reduce = useReducedMotion();

  return (
    <section className="container-wide py-16 lg:py-20">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-coral via-[#FF7A8B] to-coral p-8 md:p-14 lg:p-16">
        {/* Decorative stars */}
        <motion.div
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 right-16 text-2xl text-white/30"
          aria-hidden
        >
          ✨
        </motion.div>
        <motion.div
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-14 left-1/3 text-3xl text-sunflower"
          aria-hidden
        >
          ⭐
        </motion.div>

        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center relative">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-xs font-semibold mb-4">
              <Gift className="w-3.5 h-3.5" />
              Offres exclusives
            </div>
            <h2 className="font-display font-bold text-display-md md:text-display-lg text-balance mb-4">
              Faites plaisir, tout simplement !
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-lg text-balance">
              Des jouets pour chaque âge et chaque envie. Emballage cadeau offert
              sur toutes les commandes.
            </p>
            <Button asChild size="lg" variant="dark">
              <Link href="/boutique">
                Voir toute la boutique <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Gift box illustration */}
          <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <motion.div
              animate={reduce ? undefined : { y: [0, -12, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-[220px] drop-shadow-2xl">🎁</div>
            </motion.div>

            <motion.div
              animate={reduce ? undefined : { y: [0, -20, 0], rotate: [3, -3, 3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 right-4 text-6xl"
            >
              🧸
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-8 left-4 text-5xl"
            >
              🐰
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
