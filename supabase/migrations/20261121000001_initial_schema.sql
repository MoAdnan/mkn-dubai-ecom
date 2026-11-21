-- ==============================================================================
-- MKN ELECTRONICS DUBAI - PRODUCTION DATABASE SCHEMA
-- UAE Federal Tax Authority (FTA) Compliant | Gapless Invoicing | PINT AE Ready
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEQUENCES FOR GAPLESS UAE INVOICING & CREDIT NOTES
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 10001;
CREATE SEQUENCE IF NOT EXISTS credit_note_number_seq START 10001;

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    company_name TEXT,
    trn TEXT, -- UAE Tax Registration Number for B2B accounts
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. BRANDS
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PRODUCTS (Prices strictly in Integer Fils: AED 1.00 = 100 fils)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    sku TEXT NOT NULL UNIQUE,
    barcode TEXT,
    base_price_fils BIGINT NOT NULL CHECK (base_price_fils >= 0),
    sale_price_fils BIGINT CHECK (sale_price_fils >= 0),
    cost_price_fils BIGINT CHECK (cost_price_fils >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_deal BOOLEAN NOT NULL DEFAULT FALSE,
    deal_ends_at TIMESTAMPTZ,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    warranty_months INTEGER NOT NULL DEFAULT 12,
    warranty_type TEXT NOT NULL DEFAULT 'Official UAE Distributor Warranty',
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PRODUCT VARIANTS (e.g. Storage, Color, Specs)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    price_fils BIGINT NOT NULL CHECK (price_fils >= 0),
    sale_price_fils BIGINT CHECK (sale_price_fils >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    color TEXT,
    storage TEXT,
    ram TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. CUSTOMER ADDRESSES (7 Emirates of UAE)
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    emirate TEXT NOT NULL CHECK (emirate IN ('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Umm Al Quwain', 'Fujairah')),
    area TEXT NOT NULL,
    street_address TEXT NOT NULL,
    building_name TEXT,
    apartment_number TEXT,
    landmark TEXT,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. CARTS & CART ITEMS (Server-side & Guest sync)
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(cart_id, product_id, variant_id)
);

-- 11. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    guest_email TEXT,
    guest_phone TEXT,
    guest_name TEXT,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    subtotal_fils BIGINT NOT NULL CHECK (subtotal_fils >= 0),
    vat_fils BIGINT NOT NULL CHECK (vat_fils >= 0),
    shipping_fils BIGINT NOT NULL DEFAULT 0 CHECK (shipping_fils >= 0),
    discount_fils BIGINT NOT NULL DEFAULT 0 CHECK (discount_fils >= 0),
    total_fils BIGINT NOT NULL CHECK (total_fils >= 0),
    currency TEXT NOT NULL DEFAULT 'AED',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('card_stripe', 'card_telr', 'card_paytabs', 'cod')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    tracking_number TEXT,
    courier_name TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    is_retained_5_years BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    variant_title TEXT,
    sku TEXT,
    unit_price_fils BIGINT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_subtotal_fils BIGINT NOT NULL,
    line_vat_fils BIGINT NOT NULL,
    line_total_fils BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. PAYMENTS (Gateway Auditing & Idempotency)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    gateway TEXT NOT NULL,
    gateway_reference TEXT,
    gateway_event_id TEXT UNIQUE,
    amount_fils BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'AED',
    status TEXT NOT NULL,
    raw_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. INVOICES (UAE FTA Tax Invoices - Immutable, 5-Year Retention)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    invoice_type TEXT NOT NULL DEFAULT 'simplified' CHECK (invoice_type IN ('simplified', 'full')),
    issue_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    supply_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    supplier_name TEXT NOT NULL DEFAULT 'MKN Electronics L.L.C.',
    supplier_address TEXT NOT NULL DEFAULT 'Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE',
    supplier_trn TEXT NOT NULL DEFAULT '100482918200003',
    supplier_license TEXT NOT NULL DEFAULT '1048291',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_trn TEXT,
    customer_company_name TEXT,
    currency TEXT NOT NULL DEFAULT 'AED',
    subtotal_fils BIGINT NOT NULL,
    vat_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    vat_fils BIGINT NOT NULL,
    total_fils BIGINT NOT NULL,
    pdf_url TEXT,
    is_retained_5_years BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. INVOICE LINES (For PINT AE / Peppol e-invoicing compliance)
CREATE TABLE IF NOT EXISTS public.invoice_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    item_description TEXT NOT NULL,
    sku TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_fils BIGINT NOT NULL,
    discount_fils BIGINT NOT NULL DEFAULT 0,
    taxable_amount_fils BIGINT NOT NULL,
    vat_rate_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    vat_fils BIGINT NOT NULL,
    gross_amount_fils BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. CREDIT NOTES (For Tax Corrections without Deleting Invoices)
CREATE TABLE IF NOT EXISTS public.credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    credit_note_number TEXT NOT NULL UNIQUE,
    original_invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    amount_fils BIGINT NOT NULL,
    vat_fils BIGINT NOT NULL,
    total_fils BIGINT NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. COUPONS & PROMOTIONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value BIGINT NOT NULL CHECK (discount_value > 0),
    min_order_fils BIGINT NOT NULL DEFAULT 0,
    max_discount_fils BIGINT,
    usage_limit INTEGER,
    times_used INTEGER NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

-- 20. SETTINGS & CONFIGURATION
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 21. AUDIT LOG
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    entity_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 22. STORED PROCEDURES & BUSINESS FUNCTIONS
-- ==============================================================================

-- A. Gapless sequential invoice number generator: INV-YYYY-XXXXX
CREATE OR REPLACE FUNCTION public.generate_sequential_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_val BIGINT;
    current_yr TEXT;
BEGIN
    next_val := nextval('invoice_number_seq');
    current_yr := to_char(CURRENT_DATE, 'YYYY');
    RETURN 'INV-' || current_yr || '-' || LPAD(next_val::TEXT, 5, '0');
END;
$$;

-- B. Gapless sequential credit note number generator: CN-YYYY-XXXXX
CREATE OR REPLACE FUNCTION public.generate_sequential_credit_note_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    next_val BIGINT;
    current_yr TEXT;
BEGIN
    next_val := nextval('credit_note_number_seq');
    current_yr := to_char(CURRENT_DATE, 'YYYY');
    RETURN 'CN-' || current_yr || '-' || LPAD(next_val::TEXT, 5, '0');
END;
$$;

-- C. Atomic stock decrement function in transaction to prevent overselling
CREATE OR REPLACE FUNCTION public.decrement_product_stock_in_tx(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item RECORD;
    v_current_stock INTEGER;
BEGIN
    FOR item IN
        SELECT oi.product_id, oi.variant_id, oi.quantity, oi.product_title
        FROM public.order_items oi
        WHERE oi.order_id = p_order_id
    LOOP
        IF item.variant_id IS NOT NULL THEN
            SELECT stock_quantity INTO v_current_stock
            FROM public.product_variants
            WHERE id = item.variant_id
            FOR UPDATE;

            IF v_current_stock < item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for variant % (available: %, requested: %)',
                    item.variant_id, v_current_stock, item.quantity;
            END IF;

            UPDATE public.product_variants
            SET stock_quantity = stock_quantity - item.quantity
            WHERE id = item.variant_id;
        END IF;

        IF item.product_id IS NOT NULL THEN
            SELECT stock_quantity INTO v_current_stock
            FROM public.products
            WHERE id = item.product_id
            FOR UPDATE;

            IF v_current_stock < item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for product % "%" (available: %, requested: %)',
                    item.product_id, item.product_title, v_current_stock, item.quantity;
            END IF;

            UPDATE public.products
            SET stock_quantity = stock_quantity - item.quantity
            WHERE id = item.product_id;
        END IF;
    END LOOP;

    RETURN TRUE;
END;
$$;

-- D. Block hard deletion of invoices and orders (UAE 5-Year Legal Retention)
CREATE OR REPLACE FUNCTION public.prevent_invoice_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'UAE FTA Compliance Error: Deletion of tax invoices is strictly prohibited by law. Issue a Credit Note instead.';
END;
$$;

CREATE TRIGGER trg_prevent_invoice_delete
    BEFORE DELETE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_invoice_deletion();

CREATE TRIGGER trg_prevent_order_delete
    BEFORE DELETE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_invoice_deletion();

-- ==============================================================================
-- 23. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function: check if caller has staff or admin role
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role IN ('admin', 'staff')
          AND is_blocked = FALSE
    );
$$;

-- Categories & Brands: Public read, Staff write
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Staff can manage categories" ON public.categories FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Public can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Staff can manage brands" ON public.brands FOR ALL USING (public.is_admin_or_staff());

-- Products & Variants: Public read published only, Staff full access
CREATE POLICY "Public can view published products" ON public.products
    FOR SELECT USING (is_published = true OR public.is_admin_or_staff());
CREATE POLICY "Staff can manage products" ON public.products
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Public can view product variants" ON public.product_variants
    FOR SELECT USING (true);
CREATE POLICY "Staff can manage product variants" ON public.product_variants
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Public can view product images" ON public.product_images
    FOR SELECT USING (true);
CREATE POLICY "Staff can manage product images" ON public.product_images
    FOR ALL USING (public.is_admin_or_staff());

-- Profiles: Users can view & update own profile, Staff can view all
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin_or_staff());
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR public.is_admin_or_staff());
CREATE POLICY "Staff can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin_or_staff());

-- Addresses: Users can manage their own addresses
CREATE POLICY "Users can view own addresses" ON public.addresses
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Users can insert own addresses" ON public.addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own addresses" ON public.addresses
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own addresses" ON public.addresses
    FOR DELETE USING (auth.uid() = user_id);

-- Carts & Cart Items: Users manage own cart
CREATE POLICY "Users can view own carts" ON public.carts
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Users can create own carts" ON public.carts
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own carts" ON public.carts
    FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own cart items" ON public.cart_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));
CREATE POLICY "Users can manage own cart items" ON public.cart_items
    FOR ALL USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- Orders & Order Items: Customers view own orders, Staff view all
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Service can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can update orders" ON public.orders
    FOR UPDATE USING (public.is_admin_or_staff());

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin_or_staff())));
CREATE POLICY "Service can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

-- Invoices & Invoice Lines: Customers view invoices for their orders, Staff full access
CREATE POLICY "Users can view own invoices" ON public.invoices
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.is_admin_or_staff())));
CREATE POLICY "Staff can manage invoices" ON public.invoices
    FOR ALL USING (public.is_admin_or_staff());

CREATE POLICY "Users can view own invoice lines" ON public.invoice_lines
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.invoices inv JOIN public.orders o ON o.id = inv.order_id WHERE inv.id = invoice_id AND (o.user_id = auth.uid() OR public.is_admin_or_staff())));
CREATE POLICY "Staff can manage invoice lines" ON public.invoice_lines
    FOR ALL USING (public.is_admin_or_staff());

-- Reviews: Public can view approved reviews, Customers can create, Staff can moderate
CREATE POLICY "Public can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true OR public.is_admin_or_staff());
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff can moderate reviews" ON public.reviews
    FOR ALL USING (public.is_admin_or_staff());

-- Wishlists: Users manage their own wishlist
CREATE POLICY "Users can manage own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id);

-- Settings: Public can read general store settings, Staff can modify
CREATE POLICY "Public can read settings" ON public.settings
    FOR SELECT USING (true);
CREATE POLICY "Staff can manage settings" ON public.settings
    FOR ALL USING (public.is_admin_or_staff());

-- Audit Log: Staff only
CREATE POLICY "Staff can view audit log" ON public.audit_log
    FOR SELECT USING (public.is_admin_or_staff());

