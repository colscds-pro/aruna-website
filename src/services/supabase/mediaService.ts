import { supabase, isSupabaseConfigured } from './client';
import { SiteMedia, MediaSection } from '../../types';
import { BUNDLED_IMAGES, getBundledFallback } from '../../assets/bundledImages';

const BUCKET_NAME = 'aruna-media';

export const INITIAL_SITE_MEDIA: SiteMedia[] = [
  {
    id: 'med-hero-1',
    name: 'Hero Consulting Meeting',
    slug: 'hero-consulting-meeting',
    description: 'Foto utama hero: diskusi penasihat ARUNA bersama founder bisnis',
    storagePath: 'homepage/hero_consulting_meeting.jpg',
    publicUrl: BUNDLED_IMAGES.hero,
    mediaType: 'image/jpeg',
    altText: 'ARUNA senior advisor and business founder reviewing operational workflows',
    section: 'hero',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-ind-retail',
    name: 'Industry Retail Store',
    slug: 'industry-retail',
    description: 'Foto showcase industri retail & multi-store',
    storagePath: 'industries/industry_retail_store.jpg',
    publicUrl: BUNDLED_IMAGES.retail,
    mediaType: 'image/jpeg',
    altText: 'Retail store operations and inventory control',
    section: 'industry',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-ind-fb',
    name: 'Industry F&B Operations',
    slug: 'industry-fnb',
    description: 'Foto showcase operasional dapur & restoran F&B',
    storagePath: 'industries/industry_fb_operations.jpg',
    publicUrl: BUNDLED_IMAGES.fb,
    mediaType: 'image/jpeg',
    altText: 'F&B kitchen and centralized inventory management',
    section: 'industry',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-ind-hosp',
    name: 'Industry Hospitality',
    slug: 'industry-hospitality',
    description: 'Foto showcase hotel boutique & resort hospitality',
    storagePath: 'industries/industry_hospitality.jpg',
    publicUrl: BUNDLED_IMAGES.hospitality,
    mediaType: 'image/jpeg',
    altText: 'Hospitality operations and front office management',
    section: 'industry',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'med-author-founder',
    name: 'Founder Profile Photo',
    slug: 'founder-aruna',
    description: 'Foto profil Muhammad Nurcholish',
    storagePath: 'authors/author_nurcholish.jpg',
    publicUrl: BUNDLED_IMAGES.authorNurcholish,
    mediaType: 'image/jpeg',
    altText: 'Muhammad Nurcholish Founder ARUNA',
    section: 'about',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MediaService = {
  /**
   * Helper: Resolve any relative storage path or URL to full public URL,
   * with fallback to bundled image if unresolved.
   */
  resolveStorageUrl(pathOrUrl?: string | null, fallbackKey?: string): string {
    if (!pathOrUrl) return getBundledFallback(fallbackKey);

    const trimmed = pathOrUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    if (trimmed.startsWith('data:') || trimmed.startsWith('/assets/')) {
      return trimmed;
    }
    if (trimmed.includes('/src/assets/')) {
      return getBundledFallback(trimmed || fallbackKey);
    }

    // Relative storage path within Supabase Storage bucket 'aruna-media'
    try {
      const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(trimmed);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } catch {
      // Fallback
    }

    return getBundledFallback(fallbackKey || trimmed);
  },

  /**
   * Fetch all registered site media from public.site_media table
   * Public visitors receive active=true media according to RLS
   */
  async getAllMedia(section?: MediaSection): Promise<SiteMedia[]> {
    if (!isSupabaseConfigured) {
      return section ? INITIAL_SITE_MEDIA.filter((m) => m.section === section) : INITIAL_SITE_MEDIA;
    }

    try {
      let query = supabase.from('site_media').select('*').order('created_at', { ascending: false });
      if (section) {
        query = query.eq('section', section);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return section ? INITIAL_SITE_MEDIA.filter((m) => m.section === section) : INITIAL_SITE_MEDIA;
      }

      return data.map((d) => {
        let publicUrl = d.public_url;
        // If public_url is relative storage path or contains legacy dev path, construct full Supabase Storage URL
        if (!publicUrl || !publicUrl.startsWith('http') || publicUrl.includes('/src/assets/')) {
          if (d.storage_path) {
            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(d.storage_path);
            if (urlData?.publicUrl) {
              publicUrl = urlData.publicUrl;
            }
          }
        }

        // If publicUrl is still unresolved, provide safe bundled fallback
        if (!publicUrl || publicUrl.includes('/src/assets/')) {
          publicUrl = getBundledFallback(d.storage_path || d.slug);
        }

        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          description: d.description,
          storagePath: d.storage_path,
          publicUrl,
          mediaType: d.media_type,
          altText: d.alt_text,
          section: d.section as MediaSection,
          active: d.active,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        };
      });
    } catch {
      return section ? INITIAL_SITE_MEDIA.filter((m) => m.section === section) : INITIAL_SITE_MEDIA;
    }
  },

  /**
   * Get media by slug (e.g. 'hero-consulting-meeting')
   */
  async getMediaBySlug(slug: string): Promise<SiteMedia | null> {
    const list = await this.getAllMedia();
    const found = list.find((m) => m.slug === slug && m.active);
    if (found) return found;

    const fallbackMatch = INITIAL_SITE_MEDIA.find((m) => m.slug === slug);
    return fallbackMatch || null;
  },

  /**
   * Upload image file to Supabase Storage bucket 'aruna-media' and register in site_media table
   */
  async uploadMedia(
    file: File,
    folder: 'insights' | 'authors' | 'homepage' | 'industries' | 'case-studies' | 'general' = 'general',
    metadata: {
      name?: string;
      slug?: string;
      description?: string;
      altText?: string;
      section?: MediaSection;
    } = {}
  ): Promise<{ media: SiteMedia | null; publicUrl: string; error: Error | null }> {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return { media: null, publicUrl: '', error: new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.') };
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { media: null, publicUrl: '', error: new Error('Ukuran file maksimal adalah 5MB.') };
    }

    const cleanFilename = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const timestamp = Date.now();
    const storagePath = `${folder}/${timestamp}_${cleanFilename}`;

    if (!isSupabaseConfigured) {
      return { media: null, publicUrl: '', error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      // 1. Upload to Supabase Storage bucket 'aruna-media'
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { media: null, publicUrl: '', error: uploadError };
      }

      // 2. Get Public URL from Supabase Storage
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
      const publicUrl = urlData.publicUrl;

      // 3. Register in site_media table
      const autoSlug = metadata.slug || `${folder}-${cleanFilename.split('.')[0]}-${timestamp}`;
      const { data: recordData, error: dbError } = await supabase
        .from('site_media')
        .insert({
          name: metadata.name || file.name.split('.')[0],
          slug: autoSlug,
          description: metadata.description || null,
          storage_path: storagePath,
          public_url: publicUrl,
          media_type: file.type,
          alt_text: metadata.altText || metadata.name || null,
          section: metadata.section || 'general',
          active: true,
        })
        .select()
        .single();

      if (dbError) {
        return {
          media: {
            id: `temp-${timestamp}`,
            name: metadata.name || file.name,
            slug: autoSlug,
            storagePath,
            publicUrl,
            mediaType: file.type,
            altText: metadata.altText,
            section: metadata.section || 'general',
            active: true,
          },
          publicUrl,
          error: null,
        };
      }

      return {
        media: {
          id: recordData.id,
          name: recordData.name,
          slug: recordData.slug,
          description: recordData.description,
          storagePath: recordData.storage_path,
          publicUrl: recordData.public_url,
          mediaType: recordData.media_type,
          altText: recordData.alt_text,
          section: recordData.section as MediaSection,
          active: recordData.active,
          createdAt: recordData.created_at,
          updatedAt: recordData.updated_at,
        },
        publicUrl,
        error: null,
      };
    } catch (err: any) {
      return { media: null, publicUrl: '', error: err };
    }
  },

  /**
   * Replace existing media file in Supabase Storage
   */
  async replaceMedia(id: string, file: File): Promise<{ publicUrl: string; error: Error | null }> {
    const list = await this.getAllMedia();
    const existing = list.find((m) => m.id === id);
    if (!existing) {
      return { publicUrl: '', error: new Error('Media tidak ditemukan.') };
    }

    if (!isSupabaseConfigured) {
      return { publicUrl: '', error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      // Overwrite file at same storage path
      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(existing.storagePath, file, { upsert: true });

      if (uploadError) return { publicUrl: '', error: uploadError };

      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(existing.storagePath);
      const publicUrl = urlData.publicUrl;

      await supabase
        .from('site_media')
        .update({ public_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', id);

      return { publicUrl, error: null };
    } catch (err: any) {
      return { publicUrl: '', error: err };
    }
  },

  /**
   * Update metadata for media in public.site_media
   */
  async updateMetadata(
    id: string,
    updates: Partial<Pick<SiteMedia, 'name' | 'slug' | 'description' | 'altText' | 'section' | 'active'>>
  ): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.altText !== undefined) payload.alt_text = updates.altText;
      if (updates.section !== undefined) payload.section = updates.section;
      if (updates.active !== undefined) payload.active = updates.active;

      const { error } = await supabase.from('site_media').update(payload).eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Check whether a media is currently referenced before deleting
   */
  async checkMediaUsage(publicUrl: string): Promise<{ inUse: boolean; references: string[] }> {
    const references: string[] = [];

    try {
      // Check in articles
      const { data: articles } = await supabase
        .from('articles')
        .select('title, cover_image_url')
        .eq('cover_image_url', publicUrl);

      if (articles && articles.length > 0) {
        articles.forEach((a) => references.push(`Artikel: "${a.title}"`));
      }

      // Check in authors
      const { data: authors } = await supabase
        .from('authors')
        .select('name, avatar_url')
        .eq('avatar_url', publicUrl);

      if (authors && authors.length > 0) {
        authors.forEach((a) => references.push(`Profil Penulis: "${a.name}"`));
      }
    } catch {}

    return {
      inUse: references.length > 0,
      references,
    };
  },

  /**
   * Delete media item safely from Supabase Storage and public.site_media
   */
  async deleteMedia(id: string): Promise<{ error: Error | null }> {
    const list = await this.getAllMedia();
    const media = list.find((m) => m.id === id);
    if (!media) return { error: null };

    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      // 1. Delete from storage bucket
      await supabase.storage.from(BUCKET_NAME).remove([media.storagePath]);

      // 2. Delete record from table
      const { error } = await supabase.from('site_media').delete().eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },
};
