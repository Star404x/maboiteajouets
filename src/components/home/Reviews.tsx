"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Quote } from "lucide-react";
import { REVIEWS } from "@/lib/data/reviews";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/pagination";

export function Reviews() {
  return (
    <section className="container-wide py-16 lg:py-24">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          Avis clients
        </p>
        <h2 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance">
          Des parents <span className="text-coral">heureux</span>
        </h2>
        <div className="mt-4 inline-flex items-center gap-2">
          <Rating value={4.9} showCount={false} size="lg" />
          <span className="font-display font-bold text-navy">4.9 / 5</span>
          <span className="text-navy/60">· 2 500 avis vérifiés</span>
        </div>
      </div>

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
        {REVIEWS.map((r) => (
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
