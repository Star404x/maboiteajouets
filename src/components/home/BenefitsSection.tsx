"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "Livraison rapide",
    desc: "Livraison partout en France en 48-72h",
    color: "text-coral",
    bg: "bg-coral/10",
  },
  {
    icon: ShieldCheck,
    title: "Paiement sécurisé",
    desc: "Transactions 100% sécurisées et cryptées",
    color: "text-mint",
    bg: "bg-mint/10",
  },
  {
    icon: RotateCcw,
    title: "Satisfait ou remboursé",
    desc: "Retours simples et gratuits sous 14 jours",
    color: "text-sunflower",
    bg: "bg-sunflower/10",
  },
  {
    icon: Headphones,
    title: "Service à l'écoute",
    desc: "Une équipe disponible pour vous aider",
    color: "text-grape",
    bg: "bg-grape/10",
  },
];

export function BenefitsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-skywash">
      <div className="container-wide py-12 lg:py-20 relative">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          {/* Text + benefits */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
              Nos engagements
            </p>
            <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance mb-4">
              Pourquoi choisir <span className="text-coral">Ma boîte à jouets</span> ?
            </h2>
            <p className="text-navy/70 mb-10 max-w-lg">
              Parce que le bonheur de vos enfants mérite ce qu'il y a de mieux. Qualité,
              service et confiance depuis toujours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex gap-4 p-5 rounded-3xl bg-white shadow-soft hover:shadow-card transition-all h-full"
                >
                  <div
                    className={`h-12 w-12 rounded-2xl inline-flex items-center justify-center shrink-0 ${b.bg}`}
                  >
                    <b.icon className={`w-6 h-6 ${b.color}`} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy mb-1">{b.title}</h3>
                    <p className="text-sm text-navy/70 leading-snug">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rocket illustration — properly contained */}
          <div className="relative w-full h-96 hidden lg:block overflow-hidden">
            {/* Soft glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-sunflower/5 to-coral/5 rounded-3xl blur-2xl" />

            {/* Rocket — centered, larger but contained */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -20, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-9xl drop-shadow-2xl">🚀</div>
            </motion.div>

            {/* Smoke trail */}
            <motion.div
              animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3], y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 text-5xl"
            >
              💨
            </motion.div>

            {/* Clouds — subtle, positioned safely */}
            <motion.div
              animate={reduce ? undefined : { x: [0, 15, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 left-8 text-4xl opacity-50"
            >
              ☁️
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { x: [0, -20, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/3 right-16 text-3xl opacity-40"
            >
              ☁️
            </motion.div>

            {/* Stars — sparse, corner accents */}
            <motion.div
              animate={reduce ? undefined : { rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-8 right-12 text-2xl text-sunflower opacity-70"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-32 right-8 text-lg text-sunflower opacity-60"
            >
              ✨
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
