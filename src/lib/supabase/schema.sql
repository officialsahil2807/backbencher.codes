-- ============================================================
-- Backbencher.codes — Supabase Database & Security Schema
-- ============================================================
-- Run this script in your Supabase SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run

-- 1. Create table for dynamic site & monetization settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone (including visitors) can read site settings
CREATE POLICY "Allow public read-only access to site_settings"
    ON public.site_settings
    FOR SELECT
    USING (true);

-- Policy 2: Only authenticated admins can modify site settings
CREATE POLICY "Allow authenticated admins full access to site_settings"
    ON public.site_settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Seed initial settings (AdSense & general configuration)
INSERT INTO public.site_settings (key, value, description)
VALUES 
    (
        'adsense_publisher_id',
        '"ca-pub-XXXXXXXXXXXXXXXX"'::jsonb,
        'Google AdSense Publisher ID provided upon AdSense approval (e.g. ca-pub-1234567890123456)'
    ),
    (
        'ads_enabled',
        'false'::jsonb,
        'Master switch to activate Google AdSense ads once approval is received'
    ),
    (
        'ads_slot_header',
        '"1234567890"'::jsonb,
        'Ad unit slot ID for header/top banner placement'
    ),
    (
        'ads_slot_compiler',
        '"1234567891"'::jsonb,
        'Ad unit slot ID for online compiler bottom placement'
    ),
    (
        'ads_slot_blog',
        '"1234567892"'::jsonb,
        'Ad unit slot ID for blog sidebar & article bottom'
    )
ON CONFLICT (key) DO NOTHING;


-- 2. Create table for blog articles & guides
CREATE TABLE IF NOT EXISTS public.posts (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    author TEXT DEFAULT 'Backbencher Team',
    category TEXT DEFAULT 'Architecture',
    tags TEXT[] DEFAULT ARRAY['Programming']::TEXT[],
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    published_at DATE DEFAULT CURRENT_DATE,
    reading_time INT DEFAULT 5,
    cover_image TEXT,
    seo_title TEXT,
    seo_desc TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public visitors can view published posts
CREATE POLICY "Allow public read access to published posts"
    ON public.posts
    FOR SELECT
    USING (status = 'published');

-- Policy 2: Authenticated admins can view, insert, update, and delete all posts
CREATE POLICY "Allow authenticated admins full access to posts"
    ON public.posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_posts_updated_at ON public.posts;
CREATE TRIGGER set_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Instructions: How to Create Your Supabase Admin Account
-- ============================================================
-- 1. Go to your Supabase Project Dashboard
-- 2. Navigate to "Authentication" -> "Users"
-- 3. Click "Add User" -> "Create User"
-- 4. Enter your Admin Email (e.g., admin@yourdomain.com) and a strong Password
-- 5. Check "Auto Confirm User" so you can log in immediately
-- 6. Now you can sign in directly at /admin/login using those credentials!
