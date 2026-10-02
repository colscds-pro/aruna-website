import { supabase, isSupabaseConfigured } from './client';
import { INITIAL_ARTICLES, INITIAL_AUTHORS } from '../../data/initialArticles';
import { INITIAL_CATEGORIES_DATA } from './categoriesService';
import { INITIAL_SITE_MEDIA } from './mediaService';
import { Article, Author } from '../../types';

export interface MigrationResult {
  success: boolean;
  authorsMigrated: number;
  categoriesMigrated: number;
  articlesMigrated: number;
  mediaMigrated: number;
  message: string;
  errors: string[];
}

export const MigrationService = {
  /**
   * Check if Supabase already contains seeded data
   */
  async checkSupabaseDataCount(): Promise<{ articles: number; authors: number; categories: number; media: number }> {
    if (!isSupabaseConfigured) {
      return { articles: 0, authors: 0, categories: 0, media: 0 };
    }

    try {
      const [artRes, authRes, catRes, medRes] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('authors').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('site_media').select('id', { count: 'exact', head: true }),
      ]);

      return {
        articles: artRes.count || 0,
        authors: authRes.count || 0,
        categories: catRes.count || 0,
        media: medRes.count || 0,
      };
    } catch {
      return { articles: 0, authors: 0, categories: 0, media: 0 };
    }
  },

  /**
   * Migrate existing localStorage / initial data into Supabase
   */
  async runMigration(): Promise<MigrationResult> {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        authorsMigrated: 0,
        categoriesMigrated: 0,
        articlesMigrated: 0,
        mediaMigrated: 0,
        message: 'Supabase URL dan Publishable Key belum terkonfigurasi di environment.',
        errors: ['VITE_SUPABASE_URL atau VITE_SUPABASE_PUBLISHABLE_KEY kosong.'],
      };
    }

    const errors: string[] = [];
    let authorsMigrated = 0;
    let categoriesMigrated = 0;
    let articlesMigrated = 0;
    let mediaMigrated = 0;

    try {
      // 1. Migrate Categories
      for (const cat of INITIAL_CATEGORIES_DATA) {
        const { error } = await supabase
          .from('categories')
          .upsert({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            active: true,
          }, { onConflict: 'slug' });

        if (error) {
          errors.push(`Kategori ${cat.name}: ${error.message}`);
        } else {
          categoriesMigrated++;
        }
      }

      // 2. Migrate Authors from localStorage or INITIAL_AUTHORS
      let authorsToMigrate = INITIAL_AUTHORS;
      try {
        const rawAuth = localStorage.getItem('aruna_insights_authors_v3');
        if (rawAuth) {
          authorsToMigrate = JSON.parse(rawAuth);
        }
      } catch {}

      const authorIdMap = new Map<string, string>(); // oldId -> supabase uuid

      for (const auth of authorsToMigrate) {
        const slug = auth.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const avatarPath = auth.avatarUrl || `authors/author_${slug}.jpg`;
        const { data, error } = await supabase
          .from('authors')
          .upsert({
            name: auth.name,
            slug,
            bio: auth.bio,
            avatar_url: avatarPath,
            active: true,
          }, { onConflict: 'slug' })
          .select('id')
          .single();

        if (error) {
          errors.push(`Penulis ${auth.name}: ${error.message}`);
        } else if (data) {
          authorIdMap.set(auth.id, data.id);
          authorIdMap.set(slug, data.id);
          authorsMigrated++;
        }
      }

      // Fetch all category IDs
      const { data: dbCategories } = await supabase.from('categories').select('id, name');
      const categoryMap = new Map<string, string>();
      if (dbCategories) {
        dbCategories.forEach((c) => categoryMap.set(c.name, c.id));
      }

      // 3. Migrate Articles from localStorage or INITIAL_ARTICLES
      let articlesToMigrate = INITIAL_ARTICLES;
      try {
        const rawArt = localStorage.getItem('aruna_insights_articles_v3');
        if (rawArt) {
          articlesToMigrate = JSON.parse(rawArt);
        }
      } catch {}

      for (const art of articlesToMigrate) {
        const authorUuid = authorIdMap.get(art.authorId) || Array.from(authorIdMap.values())[0] || null;
        const categoryUuid = categoryMap.get(art.category) || null;

        const { error } = await supabase
          .from('articles')
          .upsert({
            title: art.title,
            slug: art.slug,
            excerpt: art.excerpt,
            content: art.content,
            cover_image_url: art.coverImage,
            author_id: authorUuid,
            category_id: categoryUuid,
            status: art.status,
            featured: art.featured,
            published_at: art.status === 'published' ? (art.publishedAt || art.createdAt) : null,
          }, { onConflict: 'slug' });

        if (error) {
          errors.push(`Artikel "${art.title}": ${error.message}`);
        } else {
          articlesMigrated++;
        }
      }

      // 4. Migrate Site Media
      for (const med of INITIAL_SITE_MEDIA) {
        const { data: urlData } = supabase.storage.from('aruna-media').getPublicUrl(med.storagePath);
        const resolvedUrl = urlData?.publicUrl || med.storagePath;

        const { error } = await supabase
          .from('site_media')
          .upsert({
            name: med.name,
            slug: med.slug,
            description: med.description,
            storage_path: med.storagePath,
            public_url: resolvedUrl,
            media_type: med.mediaType,
            alt_text: med.altText,
            section: med.section,
            active: med.active,
          }, { onConflict: 'slug' });

        if (error) {
          errors.push(`Media ${med.name}: ${error.message}`);
        } else {
          mediaMigrated++;
        }
      }

      const success = errors.length === 0;
      return {
        success,
        authorsMigrated,
        categoriesMigrated,
        articlesMigrated,
        mediaMigrated,
        message: success
          ? `Migrasi berhasil: ${articlesMigrated} artikel, ${authorsMigrated} penulis, ${categoriesMigrated} kategori, ${mediaMigrated} media disinkronkan ke Supabase.`
          : `Migrasi selesai dengan beberapa catatan: ${articlesMigrated} artikel berhasil dipindahkan.`,
        errors,
      };
    } catch (err: any) {
      return {
        success: false,
        authorsMigrated,
        categoriesMigrated,
        articlesMigrated,
        mediaMigrated,
        message: 'Gagal menjalankan proses migrasi.',
        errors: [err.message || String(err)],
      };
    }
  },
};
