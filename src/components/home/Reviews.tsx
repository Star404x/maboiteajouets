"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Quote } from "lucide-react";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  avatarColor?: string;
}

import "swiper/css";
import "swiper/css/pagination";

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reviews?random=true&limit=6");
        
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        
        if (data.success && data.reviews) {
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("[REVIEWS] Error fetching:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Fallback: if database empty, show empty state
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);
  return (
    <section className="container-wide py-16 lg:py-24">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          Avis clients
        </p>
        <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
          Des parents <span className="text-coral">heureux</span>
        </h2>

      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral"></div>
        </div>
      )}

      {!loading && reviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-navy/60">Pas encore d'avis. Soyez le premier !</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true, el: ".reviews-pagination" }}
          loop
          className="!pb-14"
        >
          {reviews.map((r) => (
          <SwiperSlide key={r.id} className="!h-auto">
            <div className="h-full flex flex-col gap-4 p-6 rounded-3xl bg-white shadow-soft hover:shadow-card transition-all">
              <Quote className="w-8 h-8 text-coral/20" strokeWidth={3} />
              <Rating value={r.rating} showCount={false} size="sm" />
              <p className="text-navy/80 leading-relaxed flex-1">
                &ldquo;{r.content}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-navy/5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold",
                    r.avatarColor ?? "bg-coral",
                  )}
                  aria-hidden
                >
                  {r.author[0]}
                </div>
                <div>
                  <p className="font-display font-semibold text-navy text-sm">
                    {r.author}
                  </p>
                  <p className="text-xs text-navy/60">{r.date}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          ))}
        </Swiper>
      )}

      <div className="reviews-pagination flex justify-center gap-2 -mt-6" />

      <style jsx global>{`
        .reviews-pagination .swiper-pagination-bullet {
          background: rgba(16, 42, 76, 0.2);
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 4px !important;
        }
        .reviews-pagination .swiper-pagination-bullet-active {
          background: #f45168;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
