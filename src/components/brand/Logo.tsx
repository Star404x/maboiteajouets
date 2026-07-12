import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Text-based logo. Cada letter gets an accent color.
 * Compact variant for mobile / favicon.
 */
export function Logo({
  compact = false,
  className,
  onDark = false,
}: {
  compact?: boolean;
  className?: string;
  onDark?: boolean;
}) {
  const baseColor = onDark ? "text-white" : "text-navy";

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2 group", className)}
      aria-label="Ma Boîte à Jouets — Accueil"
    >
      {/* Star icon — decorative */}
      <span
        aria-hidden
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-coral text-white text-lg shadow-pop group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
      >
        ★
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-sunflower" />
      </span>

      {!compact && (
        <span className={cn("font-display font-bold text-lg leading-none tracking-tight", baseColor)}>
          <span className="text-coral">Ma Boîte à Jouets</span>
        </span>
      )}
    </Link>
  );
}
