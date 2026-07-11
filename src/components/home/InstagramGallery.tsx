import Link from "next/link";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { cn } from "@/lib/utils";

/**
 * Placeholder Instagram grid — no real child photos.
 * Replace by real feed or curated toy shots.
 */
const TILES = [
  { emoji: "🧸", bg: "bg-pinkwash" },
  { emoji: "🚂", bg: "bg-[#FFF7E0]" },
  { emoji: "🎨", bg: "bg-[#F3EDFA]" },
  { emoji: "🧩", bg: "bg-skywash" },
  { emoji: "🚀", bg: "bg-[#EFF7DE]" },
  { emoji: "🎁", bg: "bg-pinkwash" },
];

export function InstagramGallery() {
  return (
    <section className="container-wide py-16 lg:py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
            @maboiteajouets
          </p>
          <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg">
            Notre univers sur <span className="text-coral">Instagram</span>
          </h2>
        </div>
        <Link
          href="#"
          className="inline-flex items-center gap-2 font-semibold text-navy hover:text-coral"
        >
          <InstagramIcon className="w-5 h-5" />
          Nous suivre
        </Link>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {TILES.map((t, i) => (
          <Link
            key={i}
            href="#"
            className={cn(
              "group relative aspect-square rounded-2xl overflow-hidden flex items-center justify-center shadow-soft hover:shadow-card transition-all",
              t.bg,
            )}
          >
            <span className="text-5xl transition-transform group-hover:scale-125">{t.emoji}</span>
            <div className="absolute inset-0 bg-coral/0 group-hover:bg-coral/40 transition-colors flex items-center justify-center">
              <InstagramIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
