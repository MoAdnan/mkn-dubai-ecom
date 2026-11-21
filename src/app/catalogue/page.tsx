import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/services/products";
import { DEMO_CATEGORIES, DEMO_BRANDS } from "@/lib/products-data";
import { CatalogueView } from "@/components/catalogue-view";

export const metadata: Metadata = {
  title: "Electronics Catalogue | MKN Dubai",
  description:
    "Explore Dubai's premier collection of flagship smartphones, gaming laptops, premium audio, and wearables with official UAE warranty.",
};

async function CatalogueContent() {
  const products = await getProducts();
  return (
    <CatalogueView
      initialProducts={products}
      categories={DEMO_CATEGORIES}
      brands={DEMO_BRANDS}
    />
  );
}

export default function CataloguePage() {
  return (
    <main className="min-h-screen py-4">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground animate-pulse">
            Loading electronics catalogue...
          </div>
        }
      >
        <CatalogueContent />
      </Suspense>
    </main>
  );
}

