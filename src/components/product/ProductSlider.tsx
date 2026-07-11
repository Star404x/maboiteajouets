"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

import "swiper/css";
import "swiper/css/pagination";

export function ProductSlider({ products }: { products: Product[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        onSwiper={(sw) => (swiperRef.current = sw)}
        spaceBetween={20}
        slidesPerView={1.15}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
        pagination={{ clickable: true, el: ".slider-pagination" }}
        a11y={{
          prevSlideMessage: "Produit précédent",
          nextSlideMessage: "Produit suivant",
        }}
        className="!pb-14 !overflow-visible md:!overflow-hidden"
      >
        {products.map((p) => (
          <SwiperSlide key={p.id} className="!h-auto">
            <ProductCard product={p} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Arrows */}
      <div className="hidden md:flex items-center gap-2 absolute -top-16 right-0">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="h-11 w-11 rounded-full bg-white shadow-soft hover:bg-coral hover:text-white text-navy inline-flex items-center justify-center transition-all"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="h-11 w-11 rounded-full bg-white shadow-soft hover:bg-coral hover:text-white text-navy inline-flex items-center justify-center transition-all"
          aria-label="Suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="slider-pagination absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10" />

      <style jsx global>{`
        .slider-pagination .swiper-pagination-bullet {
          background: rgba(16, 42, 76, 0.2);
          opacity: 1;
          width: 8px;
          height: 8px;
          margin: 0 4px !important;
          transition: all 0.3s;
        }
        .slider-pagination .swiper-pagination-bullet-active {
          background: #f45168;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
