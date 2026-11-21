import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { getProductBySlug, getProducts } from "@/lib/services/products";
import { DEMO_PRODUCTS, type DemoProduct } from "@/lib/products-data";
import { ProductDetailView } from "@/components/product-detail-view";
import { filsToAED } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  const list: DemoProduct[] = products && products.length > 0 ? products : DEMO_PRODUCTS;
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | MKN Dubai" };
  }

  const priceAED = filsToAED(product.sale_price_fils || product.base_price_fils);

  return {
    title: `${product.title} | Buy in Dubai UAE`,
    description: `${product.short_description} Available now for AED ${priceAED} with official UAE warranty and same-day delivery.`,
    openGraph: {
      title: `${product.title} - MKN Electronics Dubai`,
      description: product.short_description,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

async function ProductContent({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter(
    (p) => p.category_slug === product.category_slug && p.id !== product.id
  );

  const priceAED = filsToAED(product.sale_price_fils || product.base_price_fils);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.short_description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand_name,
    },
    offers: {
      "@type": "Offer",
      url: `https://mkn-dubai.ae/product/${product.slug}`,
      priceCurrency: "AED",
      price: priceAED,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "MKN Electronics L.L.C.",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews_count.toString(),
    },
  };

  return (
    <>
      <Script
        id={`product-jsonld-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView product={product} relatedProducts={related} />
    </>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-24 text-center text-muted-foreground animate-pulse">
            Loading flagship electronics device details...
          </div>
        }
      >
        <ProductContent slug={slug} />
      </Suspense>
    </main>
  );
}
