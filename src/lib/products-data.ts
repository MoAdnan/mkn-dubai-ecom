import type { Database } from "@/types/database";

export interface DemoProduct {
  id: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  sku: string;
  base_price_fils: number;
  sale_price_fils: number | null;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_deal: boolean;
  warranty_months: number;
  warranty_type: string;
  images: { url: string; alt: string; is_primary: boolean }[];
  variants: {
    id: string;
    title: string;
    sku: string;
    price_fils: number;
    sale_price_fils: number | null;
    stock: number;
    color?: string;
    storage?: string;
  }[];
  specs: Record<string, string>;
}

export const DEMO_CATEGORIES = [
  { id: "cat-1", name: "Smartphones", slug: "smartphones", count: 18, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-2", name: "Laptops & Computing", slug: "laptops", count: 12, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-3", name: "Audio & Hi-Fi", slug: "audio", count: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-4", name: "Wearables", slug: "wearables", count: 9, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-5", name: "Gaming & Consoles", slug: "gaming", count: 8, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80" },
  { id: "cat-6", name: "Smart Living & TVs", slug: "smart-home", count: 11, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" },
];

export const DEMO_BRANDS = [
  { id: "b-1", name: "Apple", slug: "apple" },
  { id: "b-2", name: "Samsung", slug: "samsung" },
  { id: "b-3", name: "Sony", slug: "sony" },
  { id: "b-4", name: "ASUS ROG", slug: "asus-rog" },
  { id: "b-5", name: "Bose", slug: "bose" },
  { id: "b-6", name: "LG", slug: "lg" },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    category_name: "Smartphones",
    category_slug: "smartphones",
    brand_id: "b-1",
    brand_name: "Apple",
    brand_slug: "apple",
    title: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
    slug: "apple-iphone-16-pro-max-256gb",
    short_description: "Aerospace Grade 5 Titanium with A18 Pro chip and 48MP Fusion Camera System.",
    description: "The ultimate iPhone. Featuring a lighter, stronger Grade 5 Titanium enclosure with refined micro-blasted texture. Powered by Apple A18 Pro silicon with hardware-accelerated ray tracing and Apple Intelligence. Capture cinematic footage in 4K 120 fps Dolby Vision.",
    sku: "MKN-APL-IP16PM-256",
    base_price_fils: 489900, // AED 4,899.00
    sale_price_fils: 469900, // AED 4,699.00
    stock_quantity: 34,
    rating: 4.95,
    reviews_count: 84,
    is_featured: true,
    is_deal: true,
    warranty_months: 12,
    warranty_type: "Official Apple UAE 1-Year Warranty (TDRA Approved)",
    images: [
      { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80", alt: "iPhone 16 Pro Max Desert Titanium", is_primary: true },
      { url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80", alt: "iPhone 16 Pro camera lenses", is_primary: false },
    ],
    variants: [
      { id: "var-1a", title: "256GB Desert Titanium", sku: "IP16PM-256-DT", price_fils: 489900, sale_price_fils: 469900, stock: 15, color: "Desert Titanium", storage: "256GB" },
      { id: "var-1b", title: "512GB Natural Titanium", sku: "IP16PM-512-NT", price_fils: 559900, sale_price_fils: null, stock: 12, color: "Natural Titanium", storage: "512GB" },
      { id: "var-1c", title: "1TB Black Titanium", sku: "IP16PM-1TB-BT", price_fils: 639900, sale_price_fils: null, stock: 7, color: "Black Titanium", storage: "1TB" },
    ],
    specs: {
      "Display": "6.9-inch Super Retina XDR OLED 120Hz ProMotion 2000 nits",
      "Processor": "Apple A18 Pro 3nm (6-core CPU, 6-core GPU, 16-core NPU)",
      "Main Camera": "48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto",
      "Video": "4K at 120 fps Dolby Vision, ProRes Log capture",
      "Battery": "Up to 33 hours video playback, 25W MagSafe fast charge",
      "Cellular": "5G Sub-6GHz, Dual eSIM / Nano-SIM (UAE TRA Approved)",
      "Durability": "Ceramic Shield next generation, IP68 water resistant",
    },
  },
  {
    id: "prod-2",
    category_id: "cat-1",
    category_name: "Smartphones",
    category_slug: "smartphones",
    brand_id: "b-2",
    brand_name: "Samsung",
    brand_slug: "samsung",
    title: "Samsung Galaxy S25 Ultra 512GB Titanium Silver",
    slug: "samsung-galaxy-s25-ultra-512gb",
    short_description: "Snapdragon 8 Elite, 200MP Nightography camera, integrated S Pen and Galaxy AI.",
    description: "The pinnacle of Android craftsmanship. Crafted with aerodynamic titanium armor, Corning Gorilla Armor anti-reflective glass, and powered by Galaxy AI for real-time translation, generative editing, and multi-day battery intelligence.",
    sku: "MKN-SAM-S25U-512",
    base_price_fils: 509900, // AED 5,099.00
    sale_price_fils: 479900, // AED 4,799.00
    stock_quantity: 28,
    rating: 4.90,
    reviews_count: 62,
    is_featured: true,
    is_deal: true,
    warranty_months: 12,
    warranty_type: "Official Samsung Gulf 1-Year Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80", alt: "Samsung Galaxy S25 Ultra Titanium Silver", is_primary: true },
    ],
    variants: [
      { id: "var-2a", title: "512GB Titanium Silver", sku: "S25U-512-TS", price_fils: 509900, sale_price_fils: 479900, stock: 16, color: "Titanium Silver", storage: "512GB" },
      { id: "var-2b", title: "1TB Titanium Black", sku: "S25U-1TB-TB", price_fils: 589900, sale_price_fils: null, stock: 12, color: "Titanium Black", storage: "1TB" },
    ],
    specs: {
      "Display": "6.8-inch Dynamic AMOLED 2X 1-120Hz 2600 nits anti-reflective",
      "Processor": "Qualcomm Snapdragon 8 Elite for Galaxy (3nm)",
      "RAM / Storage": "12GB LPDDR5X / 512GB UFS 4.0",
      "Rear Camera": "200MP Main + 50MP Periscope 5x + 50MP Ultra-Wide + 10MP 3x",
      "Battery": "5,000 mAh with 45W Super Fast Charging 2.0",
      "Stylus": "Embedded Bluetooth S Pen with low latency",
    },
  },
  {
    id: "prod-3",
    category_id: "cat-2",
    category_name: "Laptops & Computing",
    category_slug: "laptops",
    brand_id: "b-1",
    brand_name: "Apple",
    brand_slug: "apple",
    title: "Apple MacBook Pro 16\" M4 Max (36GB RAM, 1TB SSD) Space Black",
    slug: "apple-macbook-pro-16-m4-max",
    short_description: "Liquid Retina XDR display, M4 Max chip with 14-core CPU & 32-core GPU.",
    description: "Engineered for 3D simulation, heavy code compilation, and 8K ProRes timelines. The Liquid Retina XDR screen delivers 1600 nits peak HDR brightness and incredible 24-hour battery endurance.",
    sku: "MKN-APL-MBP16-M4M",
    base_price_fils: 1249900, // AED 12,499.00
    sale_price_fils: null,
    stock_quantity: 15,
    rating: 4.98,
    reviews_count: 41,
    is_featured: true,
    is_deal: false,
    warranty_months: 12,
    warranty_type: "Official Apple UAE 1-Year Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80", alt: "MacBook Pro 16 Space Black", is_primary: true },
    ],
    variants: [
      { id: "var-3a", title: "36GB / 1TB SSD Space Black", sku: "MBP16-M4M-36-1TB", price_fils: 1249900, sale_price_fils: null, stock: 15, color: "Space Black", storage: "1TB" },
    ],
    specs: {
      "Screen": "16.2-inch Liquid Retina XDR (3456x2234) 120Hz ProMotion",
      "Chip": "Apple M4 Max (14-core CPU, 32-core GPU, 16-core NPU)",
      "Memory": "36GB Unified Memory (300GB/s bandwidth)",
      "Storage": "1TB Superfast PCIe Gen 4 SSD",
      "Ports": "3x Thunderbolt 5, HDMI 2.1, SDXC slot, MagSafe 3",
      "Keyboard": "Backlit Magic Keyboard with Touch ID (Arabic/English layout)",
    },
  },
  {
    id: "prod-4",
    category_id: "cat-2",
    category_name: "Laptops & Computing",
    category_slug: "laptops",
    brand_id: "b-4",
    brand_name: "ASUS ROG",
    brand_slug: "asus-rog",
    title: "ASUS ROG Zephyrus G16 OLED (Core Ultra 9, RTX 4080, 32GB, 2TB) Eclipse Gray",
    slug: "asus-rog-zephyrus-g16-oled",
    short_description: "16-inch 2.5K 240Hz ROG Nebula OLED, CNC aluminum chassis with Slash Lighting.",
    description: "Precision CNC-machined from single-block aluminum. Equipped with NVIDIA GeForce RTX 4080 12GB GPU, Intel Core Ultra 9 processor, and liquid metal vapor chamber cooling inside an ultra-portable 1.85kg body.",
    sku: "MKN-ASUS-G16-RTX4080",
    base_price_fils: 999900, // AED 9,999.00
    sale_price_fils: 949900, // AED 9,499.00
    stock_quantity: 12,
    rating: 4.88,
    reviews_count: 29,
    is_featured: true,
    is_deal: true,
    warranty_months: 24,
    warranty_type: "ASUS Middle East 2-Year International Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80", alt: "ASUS ROG Zephyrus G16 OLED", is_primary: true },
    ],
    variants: [
      { id: "var-4a", title: "RTX 4080 / 32GB / 2TB", sku: "ROG-G16-4080", price_fils: 999900, sale_price_fils: 949900, stock: 12, color: "Eclipse Gray", storage: "2TB" },
    ],
    specs: {
      "Screen": "16-inch ROG Nebula OLED 2.5K (2560x1600) 240Hz 0.2ms G-SYNC",
      "Processor": "Intel Core Ultra 9 185H (16 cores, 22 threads, up to 5.1GHz)",
      "Graphics": "NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP with Dynamic Boost)",
      "Memory": "32GB LPDDR5X 7467MHz Dual Channel",
      "Storage": "2TB PCIe 4.0 NVMe M.2 SSD",
      "Weight": "1.85 kg ultra-thin 1.49 cm profile",
    },
  },
  {
    id: "prod-5",
    category_id: "cat-3",
    category_name: "Audio & Hi-Fi",
    category_slug: "audio",
    brand_id: "b-3",
    brand_name: "Sony",
    brand_slug: "sony",
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Midnight Black",
    slug: "sony-wh-1000xm5-black",
    short_description: "Industry-leading active noise cancellation with 8 microphones and Auto NC Optimizer.",
    description: "Experience acoustic perfection. Equipped with two processors controlling eight microphones, a specially engineered 30mm precision carbon fiber driver unit, LDAC high-resolution wireless streaming, and crystal-clear beamforming call clarity.",
    sku: "MKN-SNY-WH1000XM5-BLK",
    base_price_fils: 139900, // AED 1,399.00
    sale_price_fils: 114900, // AED 1,149.00
    stock_quantity: 45,
    rating: 4.92,
    reviews_count: 156,
    is_featured: true,
    is_deal: true,
    warranty_months: 12,
    warranty_type: "Official Sony Middle East Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80", alt: "Sony WH-1000XM5 Black", is_primary: true },
    ],
    variants: [
      { id: "var-5a", title: "Midnight Black", sku: "SNY-WH5-BLK", price_fils: 139900, sale_price_fils: 114900, stock: 25, color: "Midnight Black" },
      { id: "var-5b", title: "Platinum Silver", sku: "SNY-WH5-SLV", price_fils: 139900, sale_price_fils: 114900, stock: 20, color: "Platinum Silver" },
    ],
    specs: {
      "Noise Cancellation": "Auto NC Optimizer with Integrated Processor V1 + HD QN1",
      "Drivers": "30mm precision soft edge carbon-fiber composite driver",
      "Battery Life": "30 hours with ANC on, 3-min quick charge gives 3 hours",
      "Connectivity": "Bluetooth 5.2, LDAC, AAC, SBC, Multipoint pairing (2 devices)",
      "Microphones": "4 beamforming microphones with AI noise reduction",
    },
  },
  {
    id: "prod-6",
    category_id: "cat-3",
    category_name: "Audio & Hi-Fi",
    category_slug: "audio",
    brand_id: "b-5",
    brand_name: "Bose",
    brand_slug: "bose",
    title: "Bose QuietComfort Ultra Headphones Triple Black",
    slug: "bose-quietcomfort-ultra-black",
    short_description: "Revolutionary Bose Immersive Audio, world-class active noise cancellation and CustomTune.",
    description: "Bose flagship wireless headphones place you at the acoustic sweet spot with spatialized audio. CustomTune technology automatically analyzes your unique ear canal shape to personalize sound and noise cancellation.",
    sku: "MKN-BOS-QCU-BLK",
    base_price_fils: 149900, // AED 1,499.00
    sale_price_fils: null,
    stock_quantity: 22,
    rating: 4.86,
    reviews_count: 73,
    is_featured: false,
    is_deal: false,
    warranty_months: 12,
    warranty_type: "Bose Middle East 1-Year Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80", alt: "Bose QuietComfort Ultra", is_primary: true },
    ],
    variants: [
      { id: "var-6a", title: "Triple Black", sku: "BOS-QCU-BLK", price_fils: 149900, sale_price_fils: null, stock: 22, color: "Triple Black" },
    ],
    specs: {
      "Audio Tech": "Bose Immersive Audio Spatial Sound + CustomTune calibration",
      "Noise Cancellation": "Quiet, Aware, and Immersion modes",
      "Battery": "Up to 24 hours playback (up to 18 hours with Immersive Audio)",
      "Materials": "Ultra-soft protein leather ear cushions, polished aluminum arms",
    },
  },
  {
    id: "prod-7",
    category_id: "cat-4",
    category_name: "Wearables",
    category_slug: "wearables",
    brand_id: "b-1",
    brand_name: "Apple",
    brand_slug: "apple",
    title: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium with Trail Loop",
    slug: "apple-watch-ultra-2-49mm",
    short_description: "Rugged 49mm aerospace titanium case, 3000-nit display, precision dual-frequency GPS.",
    description: "Built to withstand endurance sports, outdoor adventures, and deep water sports down to 40 meters. Featuring the groundbreaking S9 SiP with Double Tap gesture and on-device Siri.",
    sku: "MKN-APL-AWU2-49",
    base_price_fils: 319900, // AED 3,199.00
    sale_price_fils: 299900, // AED 2,999.00
    stock_quantity: 19,
    rating: 4.94,
    reviews_count: 67,
    is_featured: true,
    is_deal: true,
    warranty_months: 12,
    warranty_type: "Apple UAE Official 1-Year Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80", alt: "Apple Watch Ultra 2 Titanium", is_primary: true },
    ],
    variants: [
      { id: "var-7a", title: "49mm Titanium with Trail Loop", sku: "AWU2-49-TL", price_fils: 319900, sale_price_fils: 299900, stock: 19, color: "Natural Titanium" },
    ],
    specs: {
      "Case": "49mm Aerospace-grade Titanium with raised sapphire front crystal",
      "Display": "Always-On Retina display up to 3000 nits brightness",
      "Water Resistance": "100m water resistant, certified EN13319 dive computer to 40m",
      "Battery": "Up to 36 hours regular use, up to 72 hours in Low Power Mode",
      "Sensors": "Dual-frequency GPS (L1+L5), Depth gauge, Water temperature sensor, ECG",
    },
  },
  {
    id: "prod-8",
    category_id: "cat-5",
    category_name: "Gaming & Consoles",
    category_slug: "gaming",
    brand_id: "b-3",
    brand_name: "Sony",
    brand_slug: "sony",
    title: "Sony PlayStation 5 Pro Console 2TB Digital Edition (UAE Official Version)",
    slug: "playstation-5-pro-console-2tb",
    short_description: "PlayStation Spectral Super Resolution (PSSR), 67% more compute units, advanced Ray Tracing.",
    description: "Witness gaming in razor-sharp 4K at 60fps and 120fps with AI-driven PSSR upscaling. Boasts 2TB ultra-fast internal NVMe storage and Wi-Fi 7 compatibility for lightning downloads.",
    sku: "MKN-SNY-PS5PRO-2TB",
    base_price_fils: 329900, // AED 3,299.00
    sale_price_fils: null,
    stock_quantity: 30,
    rating: 4.96,
    reviews_count: 98,
    is_featured: true,
    is_deal: false,
    warranty_months: 12,
    warranty_type: "Official PlayStation Middle East 1-Year Warranty",
    images: [
      { url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80", alt: "PlayStation 5 Pro 2TB Console", is_primary: true },
    ],
    variants: [
      { id: "var-8a", title: "2TB Digital Edition", sku: "PS5PRO-2TB", price_fils: 329900, sale_price_fils: null, stock: 30 },
    ],
    specs: {
      "GPU": "Custom RDNA 3 with 16.7 TFLOPs and hardware Ray Tracing accelerators",
      "Storage": "2TB Ultra-High Speed NVMe PCIe 4.0 SSD",
      "Video Output": "Support for 4K 120Hz, 8K TVs, VRR via HDMI 2.1",
      "Networking": "Wi-Fi 7 (802.11be), Bluetooth 5.1, 1Gbps Ethernet",
      "Controller": "DualSense Wireless Controller with Haptic Feedback & Adaptive Triggers",
    },
  },
];

