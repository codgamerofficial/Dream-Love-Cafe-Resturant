-- =========================================================================
-- DREAM LOVE CAFE & RESTAURANT — PRODUCTION POSTGRESQL / SUPABASE SCHEMA
-- =========================================================================

-- Enable UUID extension (for legacy support; gen_random_uuid() is built-in)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESTAURANT SETTINGS & LOCATION INFO TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Dream Love Cafe & Restaurant',
    tagline TEXT NOT NULL DEFAULT 'Multi-Cuisine Family Cafe & Restaurant',
    cuisines TEXT[] NOT NULL DEFAULT ARRAY['Indian', 'Tandoor', 'Chinese', 'Biryani', 'Beverages'],
    phone TEXT NOT NULL DEFAULT '+91 99333 88167',
    phone_secondary TEXT DEFAULT '+91 99333 88049',
    whatsapp TEXT NOT NULL DEFAULT '+919933388167',
    email TEXT DEFAULT 'dreamlovecontai@gmail.com',
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Contai',
    state TEXT NOT NULL DEFAULT 'West Bengal',
    postal_code TEXT NOT NULL DEFAULT '721404',
    plus_code TEXT NOT NULL DEFAULT 'QPHM+8QV Contai, West Bengal',
    latitude NUMERIC(10, 6) DEFAULT 21.782046,
    longitude NUMERIC(10, 6) DEFAULT 87.747065,
    google_maps_cid TEXT DEFAULT '16143850601250640223',
    google_maps_url TEXT,
    opening_hours TEXT NOT NULL DEFAULT 'Monday - Sunday: 12:00 PM - 12:00 AM',
    price_range_for_two TEXT NOT NULL DEFAULT '₹200 - ₹400',
    dining_modes TEXT[] NOT NULL DEFAULT ARRAY['Dine-in', 'Takeaway', 'No-contact Delivery'],
    reservation_enabled BOOLEAN DEFAULT TRUE,
    online_ordering_enabled BOOLEAN DEFAULT TRUE,
    delivery_enabled BOOLEAN DEFAULT TRUE,
    takeaway_enabled BOOLEAN DEFAULT TRUE,
    dine_in_enabled BOOLEAN DEFAULT TRUE,
    google_rating NUMERIC(2,1) DEFAULT 4.1,
    google_reviews_count INTEGER DEFAULT 96,
    google_reviews_url TEXT,
    justdial_rating NUMERIC(2,1) DEFAULT 4.0,
    justdial_url TEXT,
    magicpin_rating NUMERIC(2,1) DEFAULT 4.1,
    magicpin_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    order_instructions TEXT,
    reservation_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MENU CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS TABLE (Complete Schema with Image & Price Verification Metadata)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    category_slug TEXT REFERENCES public.menu_categories(slug) ON DELETE CASCADE,
    name TEXT NOT NULL,
    canonical_name TEXT,
    original_name TEXT,
    slug TEXT,
    subcategory TEXT,
    description TEXT,
    price NUMERIC(10,2),
    price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'portion_based', 'size_based', 'owner_verification_required', 'as_per_size', 'unpriced')),
    price_range TEXT,
    serving_size TEXT,
    portion TEXT,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_non_vegetarian BOOLEAN DEFAULT TRUE,
    is_veg BOOLEAN DEFAULT FALSE,
    is_egg BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Real Food Image Verification Metadata
    image_url TEXT,
    image_source TEXT DEFAULT 'Pending Owner Upload',
    image_source_url TEXT,
    image_license_status TEXT DEFAULT 'missing' CHECK (image_license_status IN ('verified', 'owner_provided', 'owner_authorized', 'licensed', 'pending_verification', 'missing')),
    image_verified BOOLEAN DEFAULT FALSE,
    image_type TEXT DEFAULT 'mock_placeholder' CHECK (image_type IN ('real_restaurant', 'mock_placeholder', 'owner_provided', 'generic_category')),
    image_match_confidence TEXT DEFAULT 'high' CHECK (image_match_confidence IN ('high', 'medium', 'low')),
    image_replacement_required BOOLEAN DEFAULT TRUE,
    image_hash TEXT,
    perceptual_hash TEXT,
    
    -- Price Verification Metadata
    price_source TEXT DEFAULT 'client_supplied_menu',
    price_source_url TEXT,
    price_verified BOOLEAN DEFAULT TRUE,
    owner_verified BOOLEAN DEFAULT TRUE,
    
    source TEXT DEFAULT 'Client Menu',
    source_url TEXT,
    data_quality_status TEXT DEFAULT 'verified' CHECK (data_quality_status IN ('verified', 'owner_review_required', 'source_conflict')),
    sort_order INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CANONICAL MENU IMAGES TABLE (Single Source of Truth for Uploaded Food Photography)
CREATE TABLE IF NOT EXISTS public.menu_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    thumbnail_url TEXT,
    image_type TEXT DEFAULT 'real_restaurant' CHECK (image_type IN ('real_restaurant', 'mock_placeholder', 'owner_provided', 'generic_category')),
    image_source TEXT DEFAULT 'owner_upload' CHECK (image_source IN ('owner_upload', 'verified_storefront', 'photographer', 'temporary_generated', 'manual_url')),
    image_verified BOOLEAN DEFAULT TRUE,
    replacement_required BOOLEAN DEFAULT FALSE,
    image_match_confidence TEXT DEFAULT 'high' CHECK (image_match_confidence IN ('high', 'medium', 'low')),
    image_hash TEXT,
    perceptual_hash TEXT,
    alt_text TEXT,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    replaced_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENU IMAGE VERSIONS TABLE (Audit History, Rollback & Restore)
CREATE TABLE IF NOT EXISTS public.menu_image_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    thumbnail_url TEXT,
    image_type TEXT DEFAULT 'real_restaurant',
    image_source TEXT DEFAULT 'owner_upload',
    is_current BOOLEAN DEFAULT TRUE,
    replaced_by TEXT,
    replaced_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REAL GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Storefront',
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    alt_text TEXT NOT NULL,
    source TEXT DEFAULT 'Client Real Photo',
    source_url TEXT,
    owner_verified BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VERIFIED REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.verified_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL CHECK (source IN ('Google', 'Justdial', 'Magicpin', 'Zomato')),
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TEXT,
    external_review_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT TRUE,
    aspects TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. DATA CONFLICTS & RECONCILIATION TABLE
CREATE TABLE IF NOT EXISTS public.data_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field TEXT NOT NULL,
    title TEXT NOT NULL,
    source_a TEXT NOT NULL,
    value_a TEXT NOT NULL,
    source_b TEXT NOT NULL,
    value_b TEXT NOT NULL,
    current_value TEXT NOT NULL,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'resolved', 'ignored')),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLE RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    special_request TEXT,
    reference_code TEXT,
    source TEXT DEFAULT 'website',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'cancelled', 'no_show')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CUSTOMER ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
    table_number TEXT,
    delivery_address TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'pay_on_delivery', 'pay_at_counter')),
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10,2) DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    discount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    menu_item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10,2),
    portion TEXT,
    special_instruction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for high-performance querying
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON public.menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_menu_items_image_verified ON public.menu_items(image_verified);
CREATE INDEX IF NOT EXISTS idx_menu_images_menu_item_id ON public.menu_images(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_image_versions_item_id ON public.menu_image_versions(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- =========================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION & SECURITY
-- =========================================================================

-- Insert bucket if missing (safe execution in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'menu-images', 
    'menu-images', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

-- Storage Object Policies for menu-images
DROP POLICY IF EXISTS "Public can view menu images" ON storage.objects;
CREATE POLICY "Public can view menu images" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
CREATE POLICY "Authenticated users can upload menu images" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
CREATE POLICY "Authenticated users can update menu images" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;
CREATE POLICY "Authenticated users can delete menu images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'menu-images');

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- =========================================================================

-- Enable RLS across all tables
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_image_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verified_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. RESTAURANT SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Public can view restaurant settings" ON public.restaurant_settings
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Authenticated users can manage restaurant settings" ON public.restaurant_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. MENU CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public can view active menu categories" ON public.menu_categories;
CREATE POLICY "Public can view active menu categories" ON public.menu_categories
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage menu categories" ON public.menu_categories;
CREATE POLICY "Authenticated users can manage menu categories" ON public.menu_categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. MENU ITEMS POLICIES
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
CREATE POLICY "Public can view menu items" ON public.menu_items
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage menu items" ON public.menu_items;
CREATE POLICY "Authenticated users can manage menu items" ON public.menu_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. MENU IMAGES POLICIES
DROP POLICY IF EXISTS "Public can view menu images" ON public.menu_images;
CREATE POLICY "Public can view menu images" ON public.menu_images
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage menu images" ON public.menu_images;
CREATE POLICY "Authenticated users can manage menu images" ON public.menu_images
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. MENU IMAGE VERSIONS POLICIES
DROP POLICY IF EXISTS "Public can view menu image versions" ON public.menu_image_versions;
CREATE POLICY "Public can view menu image versions" ON public.menu_image_versions
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage menu image versions" ON public.menu_image_versions;
CREATE POLICY "Authenticated users can manage menu image versions" ON public.menu_image_versions
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. GALLERY ITEMS POLICIES
DROP POLICY IF EXISTS "Public can view gallery items" ON public.gallery_items;
CREATE POLICY "Public can view gallery items" ON public.gallery_items
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage gallery items" ON public.gallery_items;
CREATE POLICY "Authenticated users can manage gallery items" ON public.gallery_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. VERIFIED REVIEWS POLICIES
DROP POLICY IF EXISTS "Public can view verified reviews" ON public.verified_reviews;
CREATE POLICY "Public can view verified reviews" ON public.verified_reviews
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.verified_reviews;
CREATE POLICY "Authenticated users can manage reviews" ON public.verified_reviews
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. DATA CONFLICTS POLICIES
DROP POLICY IF EXISTS "Authenticated users can manage data conflicts" ON public.data_conflicts;
CREATE POLICY "Authenticated users can manage data conflicts" ON public.data_conflicts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. RESERVATIONS POLICIES
DROP POLICY IF EXISTS "Public and anon can insert reservations" ON public.reservations;
CREATE POLICY "Public and anon can insert reservations" ON public.reservations
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public and anon can view reservations for duplicates" ON public.reservations;
CREATE POLICY "Public and anon can view reservations for duplicates" ON public.reservations
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage reservations" ON public.reservations;
CREATE POLICY "Authenticated users can manage reservations" ON public.reservations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 10. ORDERS POLICIES
DROP POLICY IF EXISTS "Public and anon can insert orders" ON public.orders;
CREATE POLICY "Public and anon can insert orders" ON public.orders
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public and anon can view orders" ON public.orders;
CREATE POLICY "Public and anon can view orders" ON public.orders
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;
CREATE POLICY "Authenticated users can manage orders" ON public.orders
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 11. ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Public and anon can insert order items" ON public.order_items;
CREATE POLICY "Public and anon can insert order items" ON public.order_items
    FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public and anon can view order items" ON public.order_items;
CREATE POLICY "Public and anon can view order items" ON public.order_items
    FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.order_items;
CREATE POLICY "Authenticated users can manage order items" ON public.order_items
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- PERMISSIONS & ROLES GRANTS
-- =========================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
