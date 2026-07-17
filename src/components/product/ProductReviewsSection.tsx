import type { Review } from "@/lib/types";
import { Star } from "lucide-react";

interface ProductReviewsSectionProps {
  reviews: Review[];
}

export function ProductReviewsSection({ reviews }: ProductReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 lg:mt-24">
      <h2 className="font-display font-bold text-navy text-2xl md:text-3xl mb-8">
        Avis clients ({reviews.length})
      </h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-6 rounded-2xl bg-cream-soft border border-navy/5 hover:border-navy/10 transition-colors"
          >
            <div className="flex items-start gap-4 mb-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy flex-shrink-0 ${review.avatarColor || 'bg-blue-100'}`}
              >
                {review.author[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-navy">{review.author}</p>
                    <p className="text-xs text-navy/60">{review.date}</p>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i <= review.rating
                            ? 'fill-sunflower text-sunflower'
                            : 'fill-navy/10 text-navy/20'
                        }`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-navy/80 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
