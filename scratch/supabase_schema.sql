-- =========================================================================
-- MAHESVARI KACHORI - SUPABASE DATABASE INITIALIZATION SCHEMA SETUP
-- =========================================================================
-- Copy and run this script in the Supabase SQL Editor to set up the backend.

-- --- 1. ENABLE NECESSARY EXTENSIONS ---
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- 2. CREATE SCHEMAS & TABLES ---

-- Profile/Users Table (linked to Firebase Auth UIDs)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Stores the Firebase UID or Supabase Auth ID
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Catalog Table
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Kachoris', 'Masalas', 'Snacks', 'Combos')),
    image_url TEXT NOT NULL,
    spice_level INT NOT NULL CHECK (spice_level BETWEEN 1 AND 5),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    weight_options TEXT[] NOT NULL DEFAULT '{}',
    ingredients TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    average_rating NUMERIC(3, 2) DEFAULT 0 CHECK (average_rating BETWEEN 0 AND 5),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Addresses Table
CREATE TABLE IF NOT EXISTS public.addresses (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    zip_code TEXT NOT NULL CHECK (length(zip_code) = 6),
    is_default INT NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    discount_amount NUMERIC(10, 2) DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(10, 2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) DEFAULT 0 CHECK (shipping_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'preparing', 'packed', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'CARD', 'COD')),
    transaction_id TEXT,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL, -- Stores structural array of Order Items: {product_id, name, price, quantity, weight}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Ledger Table
CREATE TABLE IF NOT EXISTS public.payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactive Promotional Banner Manager Table
CREATE TABLE IF NOT EXISTS public.banners (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    bg_color TEXT NOT NULL DEFAULT '#053316',
    text_color TEXT NOT NULL DEFAULT '#ffffff',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --- 3. AUTO-UPDATE UPDATED_AT TRIGGER ---
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- --- 4. SEED DATA SETUP FOR INSTANT LAUNCH ---

-- Seed initial products into the catalog
INSERT INTO public.products (name, price, description, category, image_url, spice_level, stock_quantity, weight_options, ingredients, is_featured, average_rating, review_count)
VALUES 
(
    'Heritage Golden Kachori (Pack of 4)', 
    120.00, 
    'Jhabua''s iconic recipe. Puffed crispy pastries filled with an heirloom spiced split-lentil and crushed fennel core. Served fresh with sweet tamarind and spicy mint chutneys.', 
    'Kachoris', 
    '/images/golden_kachori.jpg', 
    4, 
    150, 
    ARRAY['Pack of 4', 'Pack of 8', 'Pack of 12'], 
    'Refined Wheat Flour (Maida), Moong Dal, Fennel Seeds, Red Chilli Powder, Asafoetida (Hing), Spices, Pure Veg Oil.', 
    TRUE, 
    4.8, 
    1
),
(
    'Signature 12-Spice Kachori Masala', 
    180.00, 
    'The soul of Jhabua''s street food. A traditional blend of 12 hand-roasted, whole spices ground to perfection. Ideal for recreating authentic crispy kachoris and spicy curries at home.', 
    'Masalas', 
    '/images/kachori_masala.jpg', 
    5, 
    300, 
    ARRAY['250g', '500g', '1kg'], 
    'Dry Ginger, Coriander Seeds, Cumin Seeds, Fennel Seeds, Asafoetida (Hing), Black Salt, Black Pepper, Cinnamon, Cloves, Cardamom, Mace, Nutmeg.', 
    TRUE, 
    5.0, 
    1
),
(
    'Jhabua Shahi Pyaz Kachori (Pack of 4)', 
    140.00, 
    'Large, exceptionally flaky artisan kachoris packed with a rich, melt-in-mouth onion filling, crushed coriander seeds, and a secret spice paste. A sweet-and-spicy culinary marvel.', 
    'Kachoris', 
    '/images/pyaz_kachori.png', 
    3, 
    80, 
    ARRAY['Pack of 4', 'Pack of 8'], 
    'Wheat Flour, Chopped Sweet Onions, Gram Flour (Besan), Green Chillies, Coriander Seeds, Garam Masala, Traditional Herbs.', 
    TRUE, 
    0.0, 
    0
),
(
    'Spicy Dal Kachori Mix (Easy Cook)', 
    320.00, 
    'A pre-spiced dry flour stuffing mix. Just add warm water, roll inside dough, and fry. Serves up to 24 hot, delicious kachoris with our exact restaurant taste.', 
    'Masalas', 
    '/images/dal_kachori_mix.png', 
    4, 
    200, 
    ARRAY['500g', '1kg'], 
    'Dehydrated Moong Dal, Gram Flour, Red Chilli flakes, Crushed Fennel, Asafoetida, Citric Acid, Salt, Saffron hints.', 
    FALSE, 
    0.0, 
    0
),
(
    'Sweet Mawa Kachori (Pack of 2)', 
    150.00, 
    'A royal dessert kachori from Central India. Stuffed with pure condensed milk solids (Mawa), roasted almonds, pistachios, and saffron, then glazed in warm organic sugar syrup.', 
    'Snacks', 
    '/images/sweet_mawa_kachori.png', 
    1, 
    15, 
    ARRAY['Pack of 2', 'Pack of 4'], 
    'Refined Flour, Condensed Milk (Mawa), Almonds, Pistachios, Cashews, Saffron, Organic Cane Sugar, Pure Desi Ghee.', 
    FALSE, 
    0.0, 
    0
),
(
    'Heritage Gourmet Gifting Box', 
    450.00, 
    'A premium assortment designed for connoisseurs. Includes 1 fresh pack of Heritage Golden Kachoris, 1 jar of Signature 12-Spice Masala (250g), and a bottle of our sweet Date-Tamarind dipping syrup.', 
    'Combos', 
    '/images/gourmet_gift_box.png', 
    4, 
    100, 
    ARRAY['Standard Gift Box'], 
    'Contains Heritage Golden Kachori, Signature Masala, and Classic Date-Tamarind Sauce.', 
    TRUE, 
    0.0, 
    0
);

-- Seed initial promotional announcement banners
INSERT INTO public.banners (text, bg_color, text_color, is_active)
VALUES 
('🌱 Special Launch Code: JHABUA15 - Flat 15% Off Your Entire Cart!', '#053316', '#ffffff'),
('🚚 Free standard vacuum-sealed delivery on all order checkouts above ₹300!', '#c25010', '#ffffff');

-- --- 5. INITIAL USER SEEDS (Matching default credentials for simulations) ---
INSERT INTO public.users (id, name, email, phone, role)
VALUES 
('user-admin-uuid-2026', 'Mahesvari Admin', 'admin@mahesvari.com', '+91 94254 78201', 'admin'),
('user-customer-uuid-2026', 'Rohan Sharma', 'customer@mahesvari.com', '+91 99887 76655', 'customer')
ON CONFLICT (id) DO NOTHING;

-- Seed default initial customer address
INSERT INTO public.addresses (id, user_id, street_address, city, state, zip_code, is_default)
VALUES 
(101, 'user-customer-uuid-2026', '45, Heritage Chowk, Near Palace Gates', 'Jhabua', 'Madhya Pradesh', '457661', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed default reviews
INSERT INTO public.reviews (id, product_id, user_id, user_name, rating, comment)
VALUES 
(501, 1, 'user-customer-uuid-2026', 'Ananya Hegde', 5, 'Unbelievably crispy! The core masala is spicy and fragrant. Reminded me of my childhood visits to Jhabua. Shipped quickly and safely to Bangalore!'),
(502, 2, 'user-customer-uuid-2026', 'Rohan Sharma', 5, 'This masala is pure magic. Ground fennel and roasted coriander profiles are incredible. Elevates ordinary home curries completely.')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
