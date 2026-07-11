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
      <div className="container-wide py-20 lg:py-28 relative">
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
                  className="flex gap-4 p-5 rounded-3xl bg-white shadow-soft hover:shadow-card transition-all"
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

          {/* Rocket illustration */}
          <div className="relative aspect-square max-w-md mx-auto lg:mx-0 lg:ml-auto">
            {/* Clouds */}
            <motion.div
              animate={reduce ? undefined : { x: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-4 text-6xl opacity-70"
            >
              ☁️
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { x: [0, -25, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-24 right-6 text-5xl opacity-60"
            >
              ☁️
            </motion.div>

            {/* Stars */}
            <motion.div
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-16 right-24 text-2xl text-sunflower"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-32 left-8 text-xl"
            >
              ✨
            </motion.div>

            {/* Rocket */}
            <motion.div
              animate={reduce ? undefined : { y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-[200px] drop-shadow-2xl">🚀</div>
            </motion.div>

            {/* Smoke */}
            <motion.div
              animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 text-6xl"
            >
              💨
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
