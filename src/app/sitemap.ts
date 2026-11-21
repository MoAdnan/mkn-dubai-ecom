import { MetadataRoute } from "next";
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from "@/lib/products-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mkn-dubai.ae";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/delivery`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date("2026-11-21"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  const productPages: MetadataRoute.Sitemap = DEMO_PRODUCTS.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date("2026-11-21"),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = DEMO_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/catalogue?category=${cat.slug}`,
    lastModified: new Date("2026-11-21"),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}

