import { cn } from "@/lib/utils";
import type { Badge as BadgeType } from "@/lib/types";

const BADGE_STYLES: Record<BadgeType, string> = {
  Nouveau: "bg-mint text-white",
  Promo: "bg-gradient-coral text-white",
  "Meilleure vente": "bg-sunflower text-navy",
  "Coup de cœur": "bg-grape text-white",
};

export function Badge({
  label,
  className,
}: {
  label: BadgeType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-display tracking-wide shadow-soft",
        BADGE_STYLES[label],
        className,
      )}
    >
      {label}
    </span>
  );
}
