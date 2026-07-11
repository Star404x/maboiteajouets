import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const SIZES = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function Rating({
  value,
  count,
  size = "md",
  showCount = true,
  className,
}: RatingProps) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5" aria-label={`Note ${value} sur 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = i <= rounded;
          const half = !filled && i - 0.5 === rounded;
          return (
            <Star
              key={i}
              className={cn(
                SIZES[size],
                filled ? "fill-sunflower text-sunflower" : half ? "fill-sunflower/50 text-sunflower" : "fill-navy/10 text-navy/20",
              )}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-navy/60 font-medium">({count})</span>
      )}
    </div>
  );
}
