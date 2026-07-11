"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AGE_GROUPS = [
  { slug: "0-12m", label: "0 – 12 mois", icon: "👶", bg: "bg-pinkwash" },
  { slug: "1-3", label: "1 – 3 ans", icon: "🧸", bg: "bg-[#FFF7E0]" },
  { slug: "3-5", label: "3 – 5 ans", icon: "🧩", bg: "bg-skywash" },
  { slug: "6-8", label: "6 – 8 ans", icon: "🚴", bg: "bg-[#EFF7DE]" },
  { slug: "9+", label: "9 ans et +", icon: "🎨", bg: "bg-[#F3EDFA]" },
];

export function AgeSelector() {
  return (
    <section className="container-wide py-16 lg:py-20">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          Trouvez facilement
        </p>
        <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
          Sélection par <span className="text-coral">âge</span>
        </h2>
        <p className="mt-3 text-navy/70">
          Le bon jouet pour chaque étape du développement de votre enfant.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {AGE_GROUPS.map((age, i) => (
          <motion.div
            key={age.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link
              href={`/boutique?age=${age.slug}`}
              className={cn(
                "flex flex-col items-center gap-3 p-6 rounded-3xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all",
                age.bg,
              )}
            >
              <span className="text-5xl">{age.icon}</span>
              <span className="font-display font-bold text-navy text-center">
                {age.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
