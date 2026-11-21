-- ==============================================================================
-- MKN ELECTRONICS DUBAI - COMPREHENSIVE SEED DATA
-- Realistic flagship UAE inventory with integer fils (AED x 100) & specs
-- ==============================================================================

-- 1. STORE SETTINGS
INSERT INTO public.settings (key, value, description) VALUES
('general', '{
    "store_name": "MKN Electronics L.L.C.",
    "brand_tagline": "Dubai''s Premier Electronics Destination",
    "trade_license": "1048291",
    "trn": "100482918200003",
    "contact_email": "support@mkn-dubai.ae",
    "contact_phone": "+971 4 398 2211",
    "showroom_address": "Showroom 4, Al Quoz Industrial 1, Dubai, UAE",
    "default_currency": "AED",
    "vat_rate_percent": 5.00
}'::jsonb, 'Core business details and UAE FTA tax identification'),
('shipping', '{
    "free_shipping_threshold_fils": 25000,
    "standard_delivery_fils": 2000,
    "express_delivery_fils": 3500,
    "same_day_emirates": ["Dubai", "Sharjah", "Ajman"],
    "next_day_emirates": ["Abu Dhabi", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"]
}'::jsonb, 'UAE shipping rates and delivery schedules in integer fils'),
('payment_gateways', '{
    "stripe_enabled": true,
    "telr_enabled": false,
    "paytabs_enabled": false,
    "cod_enabled": true,
    "cod_fee_fils": 1500
}'::jsonb, 'Enabled payment providers and Cash on Delivery fee');

-- 2. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_featured) VALUES
('11111111-1111-1111-1111-111111111101', 'Smartphones', 'smartphones', 'Flagship 5G smartphones with official UAE distributor warranty', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', 1, true),
('11111111-1111-1111-1111-111111111102', 'Laptops & Computing', 'laptops', 'High-performance ultrabooks, creator workstations, and gaming rigs', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 2, true),
('11111111-1111-1111-1111-111111111103', 'Audio & Hi-Fi', 'audio', 'Audiophile headphones, noise-cancelling buds, and home theatre soundbars', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 3, true),
('11111111-1111-1111-1111-111111111104', 'Wearables', 'wearables', 'Titanium smartwatches, fitness trackers, and connected devices', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 4, true),
('11111111-1111-1111-1111-111111111105', 'Gaming & Consoles', 'gaming', 'Next-gen gaming consoles, mechanical keyboards, and precision peripherals', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', 5, true),
('11111111-1111-1111-1111-111111111106', 'Smart Living & Displays', 'smart-home', 'OLED 4K TVs, cinematic projectors, and smart home appliances', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 3. BRANDS
INSERT INTO public.brands (id, name, slug, logo_url, is_featured) VALUES
('22222222-2222-2222-2222-222222222201', 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80', true),
('22222222-2222-2222-2222-222222222202', 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80', true),
('22222222-2222-2222-2222-222222222203', 'Sony', 'sony', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80', true),
('22222222-2222-2222-2222-222222222204', 'ASUS ROG', 'asus-rog', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80', true),
('22222222-2222-2222-2222-222222222205', 'Bose', 'bose', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=200&q=80', true),
('22222222-2222-2222-2222-222222222206', 'LG', 'lg', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 4. PRODUCTS
-- Product 1: Apple iPhone 16 Pro Max
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222201',
    'Apple iPhone 16 Pro Max 256GB Desert Titanium',
    'apple-iphone-16-pro-max-256gb',
    'Titanium design, 6.9-inch Super Retina XDR display, A18 Pro chip, and pro camera system.',
    'Engineered with Grade 5 Titanium for unmatched durability and featherlight handling. Featuring the breakthrough A18 Pro processor with Apple Intelligence, advanced 48MP Fusion camera system with 5x optical telephoto lens, and the longest battery life ever on iPhone.',
    'MKN-APL-IP16PM-256',
    '195949038291',
    489900, -- AED 4,899.00
    469900, -- AED 4,699.00 (Sale)
    410000,
    34,
    5,
    true,
    true,
    true,
    timezone('utc'::text, now() + interval '7 days'),
    4.95,
    84,
    12,
    'Official Apple UAE Warranty (TRA Approved)',
    '{
        "Display": "6.9-inch Super Retina XDR OLED 120Hz ProMotion",
        "Processor": "Apple A18 Pro 6-core chip with 16-core Neural Engine",
        "Storage": "256GB NVMe",
        "Main Camera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
        "Selfie Camera": "12MP TrueDepth with autofocus",
        "Battery": "Up to 33 hours video playback, 25W MagSafe fast charging",
        "SIM": "Dual eSIM or Nano-SIM + eSIM (UAE TRA spec)",
        "Water Resistance": "IP68 dust/water resistant (up to 6m for 30 mins)"
    }'::jsonb,
    'Buy Apple iPhone 16 Pro Max in Dubai UAE | MKN Electronics',
    'Get the new iPhone 16 Pro Max 256GB in Desert Titanium with official Apple UAE warranty and same-day delivery in Dubai.'
) ON CONFLICT (id) DO NOTHING;

-- Product 2: Samsung Galaxy S25 Ultra 512GB
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111101',
    '22222222-2222-2222-2222-222222222202',
    'Samsung Galaxy S25 Ultra 512GB Titanium Silver',
    'samsung-galaxy-s25-ultra-512gb',
    'Snapdragon 8 Elite, 200MP Nightography camera, integrated S Pen and Galaxy AI.',
    'The pinnacle of Android craftsmanship. Crafted with aerodynamic titanium armor, Corning Gorilla Armor anti-reflective glass, and powered by Galaxy AI for real-time translation, generative editing, and multi-day battery intelligence.',
    'MKN-SAM-S25U-512',
    '880609492817',
    509900, -- AED 5,099.00
    479900, -- AED 4,799.00
    430000,
    28,
    4,
    true,
    true,
    true,
    timezone('utc'::text, now() + interval '5 days'),
    4.90,
    62,
    12,
    'Official Samsung Gulf 1-Year Warranty',
    '{
        "Display": "6.8-inch Dynamic AMOLED 2X 1-120Hz 2600 nits",
        "Processor": "Qualcomm Snapdragon 8 Elite for Galaxy (3nm)",
        "RAM / Storage": "12GB LPDDR5X / 512GB UFS 4.0",
        "Rear Camera": "200MP Main + 50MP Periscope 5x + 50MP Ultra Wide + 10MP 3x",
        "Battery": "5,000 mAh with 45W wired charging",
        "Stylus": "Embedded Bluetooth S Pen with air gestures"
    }'::jsonb,
    'Samsung Galaxy S25 Ultra Dubai UAE Price & Delivery',
    'Best price on Samsung Galaxy S25 Ultra 512GB in UAE. Guaranteed Samsung Gulf warranty with express shipping.'
) ON CONFLICT (id) DO NOTHING;

-- Product 3: Apple MacBook Pro 16" M4 Max
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333303',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222201',
    'Apple MacBook Pro 16" M4 Max (36GB Unified RAM, 1TB SSD) Space Black',
    'apple-macbook-pro-16-m4-max',
    'Liquid Retina XDR display, M4 Max chip with 14-core CPU & 32-core GPU, up to 24hr battery.',
    'Extreme performance for 3D rendering, machine learning modeling, and 8K video timelines. The 16.2-inch Liquid Retina XDR display delivers 1600 nits peak HDR brightness and incredible battery efficiency.',
    'MKN-APL-MBP16-M4M',
    '195949209182',
    1249900, -- AED 12,499.00
    NULL,
    1090000,
    15,
    3,
    true,
    true,
    false,
    NULL,
    4.98,
    41,
    12,
    'Apple UAE Official 1-Year Warranty',
    '{
        "Screen": "16.2-inch Liquid Retina XDR (3456x2234) 120Hz ProMotion",
        "Chip": "Apple M4 Max (14-core CPU, 32-core GPU)",
        "Memory": "36GB Unified Memory (300GB/s bandwidth)",
        "Storage": "1TB Superfast PCIe SSD",
        "Ports": "3x Thunderbolt 5, HDMI 2.1, SDXC card slot, MagSafe 3",
        "Keyboard": "Backlit Magic Keyboard with Touch ID (Arabic/English layout)"
    }'::jsonb,
    'MacBook Pro 16 M4 Max Space Black Dubai UAE | MKN',
    'Buy the ultimate pro laptop: Apple MacBook Pro 16 inch M4 Max in Space Black. Free UAE delivery & tax invoice.'
) ON CONFLICT (id) DO NOTHING;

-- Product 4: ASUS ROG Zephyrus G16 OLED Gaming Laptop
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333304',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222204',
    'ASUS ROG Zephyrus G16 OLED (Intel Core Ultra 9, RTX 4080 12GB, 32GB RAM, 2TB SSD)',
    'asus-rog-zephyrus-g16-oled',
    '16-inch 2.5K 240Hz ROG Nebula OLED, CNC aluminum chassis with Slash Lighting.',
    'Precision crafted from aerospace aluminum alloy. Features NVIDIA GeForce RTX 4080 Laptop GPU with DLSS 3.5, Intel Core Ultra 9 processor, and liquid metal vapor chamber cooling inside a featherweight 1.85kg chassis.',
    'MKN-ASUS-G16-RTX4080',
    '471138729182',
    999900, -- AED 9,999.00
    949900, -- AED 9,499.00
    850000,
    12,
    2,
    true,
    true,
    true,
    timezone('utc'::text, now() + interval '3 days'),
    4.88,
    29,
    24,
    'ASUS Middle East 2-Year International Warranty',
    '{
        "Screen": "16-inch ROG Nebula OLED 2.5K (2560x1600) 240Hz 0.2ms G-SYNC",
        "Processor": "Intel Core Ultra 9 185H (16 cores, up to 5.1GHz)",
        "Graphics": "NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP)",
        "Memory": "32GB LPDDR5X 7467MHz Dual Channel",
        "Storage": "2TB PCIe 4.0 NVMe M.2 SSD",
        "Weight": "1.85 kg ultra-thin 1.49 cm profile"
    }'::jsonb,
    'ASUS ROG Zephyrus G16 RTX 4080 Gaming Laptop Dubai',
    'Elevate your gaming with ASUS ROG Zephyrus G16 OLED RTX 4080 in Dubai. Genuine UAE stock with 2-year warranty.'
) ON CONFLICT (id) DO NOTHING;

-- Product 5: Sony WH-1000XM5 Wireless Headphones
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333305',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222203',
    'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Midnight Black',
    'sony-wh-1000xm5-black',
    'Industry-leading active noise cancellation with 8 microphones and Auto NC Optimizer.',
    'Experience pure acoustic bliss. Equipped with two processors controlling eight microphones, a specially engineered 30mm precision carbon fiber driver unit, LDAC high-resolution wireless streaming, and crystal-clear beamforming call clarity.',
    'MKN-SNY-WH1000XM5-BLK',
    '454873613258',
    139900, -- AED 1,399.00
    114900, -- AED 1,149.00 (Sale)
    95000,
    45,
    6,
    true,
    true,
    true,
    timezone('utc'::text, now() + interval '10 days'),
    4.92,
    156,
    12,
    'Official Sony Middle East Warranty',
    '{
        "Noise Cancellation": "Auto NC Optimizer with Integrated Processor V1 + HD QN1",
        "Drivers": "30mm soft edge carbon-fiber composite driver",
        "Battery Life": "30 hours with ANC on, 3-min quick charge gives 3 hours",
        "Connectivity": "Bluetooth 5.2, LDAC, AAC, SBC, Multipoint pairing (2 devices)",
        "Microphones": "4 beamforming microphones with AI noise reduction"
    }'::jsonb,
    'Sony WH-1000XM5 Noise Cancelling Headphones Dubai UAE',
    'Buy Sony WH-1000XM5 wireless ANC headphones in Dubai. Best price AED 1,149 with official Sony warranty.'
) ON CONFLICT (id) DO NOTHING;

-- Product 6: Bose QuietComfort Ultra Headphones
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333306',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222205',
    'Bose QuietComfort Ultra Headphones Triple Black',
    'bose-quietcomfort-ultra-black',
    'Revolutionary Bose Immersive Audio, world-class active noise cancellation and CustomTune.',
    'Bose flagship wireless headphones place you at the acoustic sweet spot with spatialized audio. CustomTune technology automatically analyzes your unique ear canal shape to personalize sound and noise cancellation.',
    'MKN-BOS-QCU-BLK',
    '017817845291',
    149900, -- AED 1,499.00
    NULL,
    115000,
    22,
    4,
    true,
    false,
    false,
    NULL,
    4.86,
    73,
    12,
    'Bose Middle East 1-Year Warranty',
    '{
        "Audio Tech": "Bose Immersive Audio Spatial Sound + CustomTune calibration",
        "Noise Cancellation": "Quiet, Aware, and Immersion modes",
        "Battery": "Up to 24 hours playback (up to 18 hours with Immersive Audio)",
        "Materials": "Ultra-soft protein leather ear cushions, polished aluminum arms"
    }'::jsonb,
    'Bose QuietComfort Ultra Headphones Dubai UAE | MKN',
    'Immerse in pure luxury sound with Bose QuietComfort Ultra in Dubai. Same-day delivery across UAE.'
) ON CONFLICT (id) DO NOTHING;

-- Product 7: Apple Watch Ultra 2
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333307',
    '11111111-1111-1111-1111-111111111104',
    '22222222-2222-2222-2222-222222222201',
    'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium with Trail Loop',
    'apple-watch-ultra-2-49mm',
    'Rugged 49mm aerospace titanium case, 3000-nit display, precision dual-frequency GPS.',
    'Built to withstand endurance sports, outdoor adventures, and deep water sports down to 40 meters. Featuring the groundbreaking S9 SiP with Double Tap gesture and on-device Siri.',
    'MKN-APL-AWU2-49',
    '195949102831',
    319900, -- AED 3,199.00
    299900, -- AED 2,999.00
    255000,
    19,
    3,
    true,
    true,
    true,
    timezone('utc'::text, now() + interval '4 days'),
    4.94,
    67,
    12,
    'Apple UAE Official 1-Year Warranty',
    '{
        "Case": "49mm Aerospace-grade Titanium with raised sapphire front crystal",
        "Display": "Always-On Retina display up to 3000 nits brightness",
        "Water Resistance": "100m water resistant, certified EN13319 dive computer to 40m",
        "Battery": "Up to 36 hours regular use, up to 72 hours in Low Power Mode",
        "Sensors": "Dual-frequency GPS (L1+L5), Depth gauge, Water temperature sensor, ECG"
    }'::jsonb,
    'Apple Watch Ultra 2 49mm Titanium Dubai UAE Price',
    'Get the Apple Watch Ultra 2 Titanium in Dubai at best price. Official Apple warranty with express shipping.'
) ON CONFLICT (id) DO NOTHING;

-- Product 8: Sony PlayStation 5 Pro Console 2TB
INSERT INTO public.products (
    id, category_id, brand_id, title, slug, short_description, description,
    sku, barcode, base_price_fils, sale_price_fils, cost_price_fils,
    stock_quantity, low_stock_threshold, is_published, is_featured, is_deal,
    deal_ends_at, rating, reviews_count, warranty_months, warranty_type,
    specs, seo_title, seo_description
) VALUES (
    '33333333-3333-3333-3333-333333333308',
    '11111111-1111-1111-1111-111111111105',
    '22222222-2222-2222-2222-222222222203',
    'Sony PlayStation 5 Pro Console 2TB Digital Edition (UAE Official Version)',
    'playstation-5-pro-console-2tb',
    'PlayStation Spectral Super Resolution (PSSR), 67% more compute units, advanced Ray Tracing.',
    'Witness gaming in razor-sharp 4K at 60fps and 120fps with AI-driven PSSR upscaling. Boasts 2TB ultra-fast internal NVMe storage and Wi-Fi 7 compatibility for lightning downloads.',
    'MKN-SNY-PS5PRO-2TB',
    '711719582910',
    329900, -- AED 3,299.00
    NULL,
    290000,
    30,
    5,
    true,
    true,
    false,
    NULL,
    4.96,
    98,
    12,
    'Official PlayStation Middle East 1-Year Warranty',
    '{
        "GPU": "Custom RDNA 3 with 16.7 TFLOPs and hardware Ray Tracing accelerators",
        "Storage": "2TB Ultra-High Speed NVMe PCIe 4.0 SSD",
        "Video Output": "Support for 4K 120Hz, 8K TVs, VRR via HDMI 2.1",
        "Networking": "Wi-Fi 7 (802.11be), Bluetooth 5.1, 1Gbps Ethernet",
        "Controller": "DualSense Wireless Controller with Haptic Feedback & Adaptive Triggers"
    }'::jsonb,
    'Buy PlayStation 5 Pro 2TB in Dubai UAE | MKN Electronics',
    'Order Sony PS5 Pro 2TB console in UAE. 100% genuine PlayStation Middle East stock with official warranty.'
) ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
-- iPhone 16 Pro Max
('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80', 'Apple iPhone 16 Pro Max Desert Titanium front angle', 1, true),
('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80', 'Apple iPhone 16 Pro Max camera module close-up', 2, false),
-- Samsung Galaxy S25 Ultra
('33333333-3333-3333-3333-333333333302', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80', 'Samsung Galaxy S25 Ultra front and S Pen', 1, true),
-- MacBook Pro 16 M4 Max
('33333333-3333-3333-3333-333333333303', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80', 'MacBook Pro 16 Space Black open display', 1, true),
-- ASUS ROG Zephyrus G16
('33333333-3333-3333-3333-333333333304', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80', 'ASUS ROG Zephyrus G16 gaming laptop chassis', 1, true),
-- Sony WH-1000XM5
('33333333-3333-3333-3333-333333333305', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', 'Sony WH-1000XM5 Black wireless headphones', 1, true),
-- Bose QuietComfort Ultra
('33333333-3333-3333-3333-333333333306', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80', 'Bose QuietComfort Ultra headphones side profile', 1, true),
-- Apple Watch Ultra 2
('33333333-3333-3333-3333-333333333307', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80', 'Apple Watch Ultra 2 49mm Titanium on display', 1, true),
-- PS5 Pro
('33333333-3333-3333-3333-333333333308', 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80', 'Sony PlayStation 5 Pro console and DualSense', 1, true)
ON CONFLICT (id) DO NOTHING;

-- 6. PRODUCT VARIANTS (Colors & Storage)
INSERT INTO public.product_variants (product_id, title, sku, price_fils, sale_price_fils, stock_quantity, color, storage) VALUES
-- iPhone 16 Pro Max variants
('33333333-3333-3333-3333-333333333301', '256GB Desert Titanium', 'APL-IP16PM-256-DT', 489900, 469900, 15, 'Desert Titanium', '256GB'),
('33333333-3333-3333-3333-333333333301', '512GB Natural Titanium', 'APL-IP16PM-512-NT', 559900, NULL, 12, 'Natural Titanium', '512GB'),
('33333333-3333-3333-3333-333333333301', '1TB Black Titanium', 'APL-IP16PM-1TB-BT', 639900, NULL, 7, 'Black Titanium', '1TB'),
-- Galaxy S25 Ultra variants
('33333333-3333-3333-3333-333333333302', '512GB Titanium Silver', 'SAM-S25U-512-TS', 509900, 479900, 16, 'Titanium Silver', '512GB'),
('33333333-3333-3333-3333-333333333302', '1TB Titanium Black', 'SAM-S25U-1TB-TB', 589900, NULL, 12, 'Titanium Black', '1TB'),
-- Sony WH-1000XM5
('33333333-3333-3333-3333-333333333305', 'Midnight Black', 'SNY-WH5-BLK', 139900, 114900, 25, 'Midnight Black', NULL),
('33333333-3333-3333-3333-333333333305', 'Platinum Silver', 'SNY-WH5-SLV', 139900, 114900, 20, 'Platinum Silver', NULL)
ON CONFLICT (id) DO NOTHING;

-- 7. COUPONS & PROMOTIONS
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, min_order_fils, max_discount_fils, usage_limit, is_active) VALUES
('44444444-4444-4444-4444-444444444401', 'WELCOME10', '10% discount on your first tech order over AED 500', 'percentage', 10, 50000, 20000, 5000, true),
('44444444-4444-4444-4444-444444444402', 'DUBAI50', 'AED 50 instant voucher on orders above AED 400', 'fixed', 5000, 40000, NULL, 2000, true),
('44444444-4444-4444-4444-444444444403', 'TECHVIP', '15% VIP discount on pro laptops and audio over AED 2,000', 'percentage', 15, 200000, 50000, 500, true)
ON CONFLICT (id) DO NOTHING;

