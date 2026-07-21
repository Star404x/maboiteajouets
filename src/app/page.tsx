import { Hero } from "@/components/home/Hero";
import { CategoriesStrip } from "@/components/home/CategoriesStrip";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { NewProductsSlider } from "@/components/home/NewProductsSlider";
// AUDIT: BrandsStrip removed until legal verification of brand usage rights
// import { BrandsStrip } from "@/components/home/BrandsStrip";
import { PromoBanner } from "@/components/home/PromoBanner";
import { AgeSelector } from "@/components/home/AgeSelector";
import { Reviews } from "@/components/home/Reviews";
import { Newsletter } from "@/components/home/Newsletter";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesStrip />
      <FeaturedProducts />
      <BenefitsSection />
      <NewProductsSlider />
      <AgeSelector />
      <PromoBanner />
      <Reviews />
      {/* <BrandsStrip /> — REMOVED: Requires verification of brand usage rights */}
      <Newsletter />
      <InstagramGallery />
    </>
  );
}
