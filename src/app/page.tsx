import { Suspense } from "react";
import { HeroSection } from "@/components/hero-section";
import { CategoryGrid } from "@/components/category-grid";
import { DealsStrip } from "@/components/deals-strip";
import { TrendingProducts } from "@/components/trending-products";
import { BrandStrip } from "@/components/brand-strip";
import { NewsletterSection } from "@/components/newsletter-section";
import { getFeaturedProducts, getDealProducts } from "@/lib/services/products";

async function DealsData() {
  const dealProducts = await getDealProducts();
  return <DealsStrip dealProducts={dealProducts} />;
}

async function TrendingData() {
  const featuredProducts = await getFeaturedProducts();
  return <TrendingProducts products={featuredProducts} />;
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 3D Hero Section */}
      <HeroSection />

      {/* 2. Categories Grid */}
      <CategoryGrid />

      {/* 3. Limited-Time Dubai Deals Strip with Live Countdown */}
      <Suspense
        fallback={
          <div className="py-12 max-w-7xl mx-auto px-4 text-center text-muted-foreground animate-pulse">
            Loading Dubai tech deals...
          </div>
        }
      >
        <DealsData />
      </Suspense>

      {/* 4. Trending Electronics Flagship Collection */}
      <Suspense
        fallback={
          <div className="py-16 max-w-7xl mx-auto px-4 text-center text-muted-foreground animate-pulse">
            Loading trending electronics...
          </div>
        }
      >
        <TrendingData />
      </Suspense>

      {/* 5. Official Brand Partners */}
      <BrandStrip />

      {/* 6. VIP Tech Club & AED 100 Voucher */}
      <NewsletterSection />
    </div>
  );
}
