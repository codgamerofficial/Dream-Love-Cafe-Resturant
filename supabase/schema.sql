-- ========================================================
-- DREAM LOVE CAFE & RESTAURANT - SUPABASE DATABASE SCHEMA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESTAURANT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'Dream Love Cafe & Restaurant',
    tagline TEXT NOT NULL DEFAULT 'Multi-Cuisine Family Cafe & Restaurant',
    cuisines TEXT[] NOT NULL DEFAULT ARRAY['Indian', 'Tandoor', 'Chinese', 'Biryani'],
    phone TEXT NOT NULL DEFAULT '+91 99333 88167',
    whatsapp TEXT NOT NULL DEFAULT '+919933388167',
    address TEXT NOT NULL,
    plus_code TEXT NOT NULL,
    google_maps_cid TEXT,
    google_maps_url TEXT,
    opening_hours TEXT NOT NULL,
    price_range_for_two TEXT NOT NULL,
    dining_modes TEXT[] NOT NULL DEFAULT ARRAY['Dine-in', 'Takeaway', 'No-contact Delivery'],
    google_rating NUMERIC(2,1) DEFAULT 4.1,
    google_reviews_count INTEGER DEFAULT 96,
    google_reviews_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    order_instructions TEXT,
    reservation_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MENU CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category_slug TEXT REFERENCES public.menu_categories(slug) ON DELETE CASCADE,
    description TEXT,
    price NUMERIC(10,2),
    price_range TEXT,
    portion TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_veg BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    image_url TEXT NOT NULL,
    caption TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 20),
    special_request TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE (For logging WhatsApp checkout orders with consent)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'preparing', 'ready', 'completed', 'cancelled')),
    total_amount NUMERIC(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    price NUMERIC(10,2),
    portion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMER STORIES TABLE
CREATE TABLE IF NOT EXISTS public.customer_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author TEXT NOT NULL,
    date_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    source TEXT DEFAULT 'Customer Story',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON public.menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_stories ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Settings" ON public.restaurant_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.menu_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery Items" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Public Read Customer Stories" ON public.customer_stories FOR SELECT USING (true);

-- Public Reservation & Order Creation Policies
CREATE POLICY "Public Insert Reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Admin Write & Read Full Access (Authenticated Admin Role)
CREATE POLICY "Admin Full Access Settings" ON public.restaurant_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Categories" ON public.menu_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Menu Items" ON public.menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Gallery" ON public.gallery_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Reservations" ON public.reservations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Order Items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Customer Stories" ON public.customer_stories FOR ALL USING (auth.role() = 'authenticated');
