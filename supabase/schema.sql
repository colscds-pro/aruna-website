-- ==============================================================================
-- ARUNA WEBSITE — PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY
-- Platform: Supabase (PostgreSQL 15+)
-- Storage Bucket: aruna-media
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE: profiles
-- Application-level profile linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLE: authors
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLE: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLE: articles
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABLE: site_media
-- Registry of managed website images (hero, industries, case study, etc.)
CREATE TABLE IF NOT EXISTS public.site_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image/jpeg',
  alt_text TEXT,
  section TEXT NOT NULL DEFAULT 'general' CHECK (section IN ('hero', 'industry', 'case-study', 'about', 'general', 'insights')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_authors_updated_at
  BEFORE UPDATE ON public.authors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_site_media_updated_at
  BEFORE UPDATE ON public.site_media
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. AUTH TRIGGER: Automatically create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;

-- Helper function: check if caller is an authenticated staff member (admin or editor)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
-- Users can view their own profile; staff can view all profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_staff());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- AUTHORS POLICIES
-- Public can view active authors
CREATE POLICY "Public can view active authors"
  ON public.authors FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

-- Staff can insert, update, delete authors
CREATE POLICY "Staff can insert authors"
  ON public.authors FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update authors"
  ON public.authors FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete authors"
  ON public.authors FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- CATEGORIES POLICIES
-- Public can view active categories
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

CREATE POLICY "Staff can insert categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ARTICLES POLICIES
-- Public can ONLY view published articles
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_staff());

CREATE POLICY "Staff can insert articles"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update articles"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete articles"
  ON public.articles FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- SITE_MEDIA POLICIES
-- Public can view active site media
CREATE POLICY "Public can view active site media"
  ON public.site_media FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

CREATE POLICY "Staff can insert site media"
  ON public.site_media FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can update site media"
  ON public.site_media FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete site media"
  ON public.site_media FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ==============================================================================
-- 10. SUPABASE STORAGE SETUP: aruna-media
-- ==============================================================================

-- Create bucket 'aruna-media' if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('aruna-media', 'aruna-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read access for aruna-media
CREATE POLICY "Public read aruna-media"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'aruna-media');

-- Storage RLS: Staff can upload/update/delete objects in aruna-media
CREATE POLICY "Staff upload aruna-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'aruna-media');

CREATE POLICY "Staff update aruna-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'aruna-media');

CREATE POLICY "Staff delete aruna-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'aruna-media');

-- ==============================================================================
-- 11. INITIAL SEED DATA
-- ==============================================================================

-- Seed Author: Muhammad Nurcholish
INSERT INTO public.authors (id, name, slug, bio, avatar_url, active)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Muhammad Nurcholish',
  'muhammad-nurcholish',
  'Founder ARUNA. Praktisi transformasi bisnis dan implementasi ERP untuk industri retail, F&B, dan hospitality di Indonesia. Berfokus membantu pemilik bisnis membangun struktur operasional yang masuk akal sebelum menyentuh konfigurasi sistem teknologi.',
  '/src/assets/images/author_nurcholish_1790919189982.jpg',
  true
) ON CONFLICT (slug) DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, name, slug, description, active)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'OPINION', 'opinion', 'Pandangan strategis mengenai tata kelola dan filosofi bisnis.', true),
  ('22222222-2222-2222-2222-222222222202', 'BUSINESS', 'business', 'Analisis skalabilitas, ekspansi cabang, dan dinamika margin.', true),
  ('22222222-2222-2222-2222-222222222203', 'ERP & TECHNOLOGY', 'erp-technology', 'Implementasi sistem, arsitektur data, dan integrasi modul.', true),
  ('22222222-2222-2222-2222-222222222204', 'INDUSTRY', 'industry', 'Konteks lapangan sektor Retail, F&B, dan Hospitality.', true),
  ('22222222-2222-2222-2222-222222222205', 'FIELD NOTES', 'field-notes', 'Catatan observasi langsung dari lantai toko dan gudang.', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Site Media Registry
INSERT INTO public.site_media (name, slug, description, storage_path, public_url, section, alt_text, active)
VALUES
  ('Hero Consulting Meeting', 'hero-consulting-meeting', 'Foto utama hero: diskusi penasihat ARUNA bersama founder bisnis', 'homepage/hero_consulting_meeting.jpg', '/src/assets/images/hero_consulting_meeting_1790916424867.jpg', 'hero', 'ARUNA senior advisor and business founder reviewing operational workflows', true),
  ('Industry Retail Store', 'industry-retail', 'Foto showcase industri retail & multi-store', 'industries/industry_retail_store.jpg', '/src/assets/images/industry_retail_store_1790916438753.jpg', 'industry', 'Retail store operations and inventory control', true),
  ('Industry F&B Operations', 'industry-fnb', 'Foto showcase operasional dapur & restoran F&B', 'industries/industry_fb_operations.jpg', '/src/assets/images/industry_fb_operations_1790916451581.jpg', 'industry', 'F&B kitchen and centralized inventory management', true),
  ('Industry Hospitality', 'industry-hospitality', 'Foto showcase hotel boutique & resort hospitality', 'industries/industry_hospitality.jpg', '/src/assets/images/industry_hospitality_1790916463500.jpg', 'industry', 'Hospitality operations and front office management', true),
  ('Founder Profile Photo', 'founder-aruna', 'Foto profil Muhammad Nurcholish', 'authors/author_nurcholish.jpg', '/src/assets/images/author_nurcholish_1790919189982.jpg', 'about', 'Muhammad Nurcholish Founder ARUNA', true)
ON CONFLICT (slug) DO NOTHING;
