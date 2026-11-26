import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/components/cart-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFloatingButton } from "@/components/whatsapp-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MKN Electronics Dubai | Premium Tech & Audio",
    template: "%s | MKN Dubai",
  },
  description:
    "Leading destination for flagship smartphones, gaming laptops, premium audio, and electronics in Dubai, UAE. 100% genuine UAE warranty and same-day express delivery.",
  keywords: [
    "Electronics Dubai",
    "UAE Tech Store",
    "Smartphones Dubai",
    "Gaming Laptops UAE",
    "Buy Electronics Online UAE",
  ],
  authors: [{ name: "MKN Electronics LLC" }],
  creator: "MKN Electronics Dubai",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://mkn-dubai-ecom.vercel.app",
    title: "MKN Electronics Dubai | Premium Tech & Audio",
    description: "Premium electronics delivered across all 7 Emirates. Genuine warranty & 5% VAT tax invoices.",
    siteName: "MKN Electronics Dubai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <WhatsAppFloatingButton />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
