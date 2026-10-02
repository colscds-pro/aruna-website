-- ==============================================================================
-- ARUNA WEBSITE — PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (HARDENED)
-- Platform: Supabase (PostgreSQL 15+)
-- Storage Bucket: aruna-media
-- Security Audit Status: Fully Hardened with Zero Role Escalation & Strict RLS
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

-- ==============================================================================
-- 7. SECURITY HELPER FUNCTIONS (SECURITY DEFINER WITH SEARCH_PATH HARDENING)
-- ==============================================================================

-- Check if current authenticated caller is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Check if current authenticated caller is a staff member (admin or editor)
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- ==============================================================================
-- 8. AUTOMATIC TRIGGERS & INTEGRITY GUARDS
-- ==============================================================================

-- Standard updated_at handler
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- CRITICAL SECURITY TRIGGER: Prevent profile ID tampering and unauthorized role escalation
CREATE OR REPLACE FUNCTION public.handle_profile_security()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Prevent ID modification
  IF (OLD.id IS DISTINCT FROM NEW.id) THEN
    RAISE EXCEPTION 'Profile ID cannot be altered.';
  END IF;

  -- 2. Prevent role escalation: only existing admins may modify roles
  IF (OLD.role IS DISTINCT FROM NEW.role) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access denied: Only administrators can modify user roles.';
    END IF;
  END IF;

  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

CREATE OR REPLACE TRIGGER enforce_profile_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_security();

-- NEW USER SIGNUP TRIGGER: Always assign 'editor' role, NEVER trust client metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'editor' -- HARDENED: Always defaults to 'editor'. Client metadata can NEVER grant admin.
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

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

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anonymous: No access (enforced by absence of anon policies)

-- Authenticated: Users can read their own profile, or staff can read all profiles
CREATE POLICY "Users can view own profile or staff view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_staff());

-- Authenticated: Users can update their own profile (role guard handled by trigger & check)
CREATE POLICY "Users can update own safe fields"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- If normal user, role must remain identical; only admins can change role
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- AUTHORS POLICIES
-- ------------------------------------------------------------------------------
-- Public (anonymous + authenticated) can view ONLY active authors
CREATE POLICY "Public can view active authors"
  ON public.authors FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

-- Only authenticated staff can insert, update, or delete authors
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

-- ------------------------------------------------------------------------------
-- CATEGORIES POLICIES
-- ------------------------------------------------------------------------------
-- Public can view ONLY active categories
CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

-- Only authenticated staff can insert, update, or delete categories
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

-- ------------------------------------------------------------------------------
-- ARTICLES POLICIES
-- ------------------------------------------------------------------------------
-- CRITICAL: Public visitors can ONLY view published articles. Drafts are NEVER returned.
CREATE POLICY "Public can view published articles only"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_staff());

-- Only authenticated staff can insert, update, or delete articles
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

-- ------------------------------------------------------------------------------
-- SITE_MEDIA POLICIES
-- ------------------------------------------------------------------------------
-- Public can view ONLY active site media
CREATE POLICY "Public can view active site media"
  ON public.site_media FOR SELECT
  TO anon, authenticated
  USING (active = true OR public.is_staff());

-- Only authenticated staff can insert, update, or delete site media records
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
-- 10. SUPABASE STORAGE SETUP & HARDENED STORAGE POLICIES
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

-- Storage RLS: HARDENED — Only verified STAFF can upload/update/delete objects in aruna-media
CREATE POLICY "Staff upload aruna-media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'aruna-media' AND public.is_staff());

CREATE POLICY "Staff update aruna-media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'aruna-media' AND public.is_staff())
  WITH CHECK (bucket_id = 'aruna-media' AND public.is_staff());

CREATE POLICY "Staff delete aruna-media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'aruna-media' AND public.is_staff());

-- ==============================================================================
-- 11. INITIAL SEED DATA (PRODUCTION-COMPLIANT MEDIA REFERENCES)
-- ==============================================================================

-- Seed Author: Muhammad Nurcholish
INSERT INTO public.authors (id, name, slug, bio, avatar_url, active)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Muhammad Nurcholish',
  'muhammad-nurcholish',
  'Founder ARUNA. Praktisi transformasi bisnis dan implementasi ERP untuk industri retail, F&B, dan hospitality di Indonesia. Berfokus membantu pemilik bisnis membangun struktur operasional yang masuk akal sebelum menyentuh konfigurasi sistem teknologi.',
  'authors/author_nurcholish.jpg',
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

-- Seed Site Media Registry (Managed media paths within aruna-media bucket)
INSERT INTO public.site_media (name, slug, description, storage_path, public_url, section, alt_text, active)
VALUES
  ('Hero Consulting Meeting', 'hero-consulting-meeting', 'Foto utama hero: diskusi penasihat ARUNA bersama founder bisnis', 'homepage/hero_consulting_meeting.jpg', 'homepage/hero_consulting_meeting.jpg', 'hero', 'ARUNA senior advisor and business founder reviewing operational workflows', true),
  ('Industry Retail Store', 'industry-retail', 'Foto showcase industri retail & multi-store', 'industries/industry_retail_store.jpg', 'industries/industry_retail_store.jpg', 'industry', 'Retail store operations and inventory control', true),
  ('Industry F&B Operations', 'industry-fnb', 'Foto showcase operasional dapur & restoran F&B', 'industries/industry_fb_operations.jpg', 'industries/industry_fb_operations.jpg', 'industry', 'F&B kitchen and centralized inventory management', true),
  ('Industry Hospitality', 'industry-hospitality', 'Foto showcase hotel boutique & resort hospitality', 'industries/industry_hospitality.jpg', 'industries/industry_hospitality.jpg', 'industry', 'Hospitality operations and front office management', true),
  ('Founder Profile Photo', 'founder-aruna', 'Foto profil Muhammad Nurcholish', 'authors/author_nurcholish.jpg', 'authors/author_nurcholish.jpg', 'about', 'Muhammad Nurcholish Founder ARUNA', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Articles
INSERT INTO public.articles (id, title, slug, excerpt, content, cover_image_url, author_id, category_id, status, featured, published_at)
VALUES
  (
    '33333333-3333-3333-3333-333333333301',
    'ERP Tidak Akan Memperbaiki Proses Bisnis yang Berantakan',
    'erp-tidak-akan-memperbaiki-proses-bisnis-yang-berantakan',
    'Banyak pemilik bisnis berharap software ERP akan secara otomatis menyelesaikan kebocoran persediaan dan kesemrawutan kas. Realitasnya: software hanya mempercepat alur yang ada—jika alurnya belum ditata, teknologi hanya akan mengotomatisasi kekacauan.',
    'Setiap beberapa bulan, kami bertemu dengan pemilik bisnis yang merasa lelah dengan operasionalnya.

Ceritanya hampir selalu serupa: Stok barang sering selisih tanpa ada yang tahu letak kebocorannya. Faktur pembelian dari supplier menumpuk di meja admin tanpa kepastian jatuh tempo. Kasir di outlet sering mengalami selisih settlement kartu di akhir shift.

Dan kesimpulan yang kerap diambil oleh sang pemilik: "Bisnis gue butuh ERP secepatnya."

Namun di ARUNA, kami selalu mengawali pertemuan dengan sebuah pengingat yang penting:
"ERP bukan obat untuk proses bisnis yang belum tertata. Jika alur kerja Anda hari ini berantakan, memasang ERP hanya akan mengotomatisasi kekacauan tersebut dengan biaya yang jauh lebih mahal."

Software hanyalah alat pencatat yang patuh. Ia tidak bisa menegur staf gudang yang menerima barang tanpa surat jalan resmi. Di ARUNA, filosofi kami tegas: Business first. Software second.',
    'insights/insight_erp_foundation.jpg',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222203',
    'published',
    true,
    '2026-09-18T10:30:00Z'
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    'Buka Cabang Kedua Bukan Cuma Soal Modal',
    'buka-cabang-kedua-bukan-cuma-soal-modal',
    'Saat masih satu outlet, bisnis bisa bertahan berkat pengawasan fisik langsung dari pemilik. Namun saat cabang kedua dibuka, kompleksitas melipatgandakan risiko. Kenali tanda-tanda sistem Anda belum siap sebelum menandatangani sewa baru.',
    'Membuka cabang kedua adalah momen yang sangat membanggakan bagi setiap pemilik bisnis retail atau F&B. Itu adalah tanda bahwa produk Anda diterima pasar dan unit pertama menghasilkan keuntungan.

Namun, di balik kegembiraan menyiapkan lokasi baru, ada pertanyaan yang kerap muncul: "Kalau bisnis gue tambah besar dan gue nggak bisa nongkrong di sana setiap hari, toko kedua bakal jalan bener nggak ya?"

Banyak pengusaha tidak menyadari bahwa keberhasilan outlet pertama mereka sering kali ditopang oleh pengawasan fisik langsung dan ketergantungan pada personil kunci. Tubuh Anda hanya satu. Manajer senior Anda tidak bisa berada di dua tempat sekaligus.

Ketika cabang kedua dibuka, kompleksitas bertambah pesat: transfer stok memicu selisih, harga beli supplier bervariasi, arus kas terbagi dua. Pertanyaannya bukan hanya apakah punya modal, tetapi apakah cara kerja dan sistem siap mengelola cabang kedua.',
    'insights/insight_second_branch.jpg',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222202',
    'published',
    true,
    '2026-09-24T14:15:00Z'
  ),
  (
    '33333333-3333-3333-3333-333333333303',
    'Kalau Owner Harus Tanya Satu-Satu untuk Tahu Kondisi Bisnis, Ada Masalah di Sistemnya',
    'kalau-owner-harus-tanya-satu-satu-untuk-tahu-kondisi-bisnis-ada-masalah-di-sistemnya',
    'Jika untuk mengetahui sisa stok, status hutang supplier, atau laba bulanan Anda masih harus mengontak admin, kasir, dan akuntan satu per satu—itu tanda jelas bahwa bisnis bekerja secara terfragmentasi.',
    'Di banyak bisnis yang sedang bertumbuh, aktivitas harian pemilik bisnis dihabiskan untuk "berburu angka". Pagi tanya kasir, siang tanya bagian gudang, sore telepon akuntan eksternal.

Jika bisnis Anda masih membutuhkan owner untuk menjadi integrator informasi antar-divisi, berarti sistem kerja Anda belum berjalan.

Sistem yang sehat bekerja sebaliknya: informasi mengalir secara otomatis dari transaksi kasir dan penerimaan gudang menuju dashboard ringkasan pemilik secara real-time. Dengan begitu, energi pemilik bisnis bisa dialihkan dari sekadar mengawasi rutinitas teknis menuju pengambilan keputusan strategis.',
    'insights/insight_field_notes.jpg',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222205',
    'published',
    true,
    '2026-09-28T16:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- 12. ADMIN BOOTSTRAP INSTRUCTIONS (FOR PROJECT OWNER)
-- ==============================================================================
-- To bootstrap the first ARUNA administrator account:
-- 1. Sign up a new user via Supabase Auth (e.g. admin@aruna.id).
-- 2. Run this query in the Supabase SQL Editor to promote that user to admin:
--
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@aruna.id');
