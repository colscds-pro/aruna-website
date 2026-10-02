import { supabase, isSupabaseConfigured } from './client';
import { SiteMedia, MediaSection } from '../../types';

const BUCKET_NAME = 'aruna-media';
const LOCAL_MEDIA_KEY = 'aruna_site_media_v1';

export const INITIAL_SITE_MEDIA: SiteMedia[] = [
  {
    id: 'med-hero-1',
    name: 'Hero Consulting Meeting',
    slug: 'hero-consulting-meeting',
    description: 'Foto utama hero: diskusi penasihat ARUNA bersama founder bisnis',
    storagePath: 'homepage/hero_consulting_meeting.jpg',
    publicUrl: '/src/assets/images/hero_consulting_meeting_1790916424867.jpg',
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
    publicUrl: '/src/assets/images/industry_retail_store_1790916438753.jpg',
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
    publicUrl: '/src/assets/images/industry_fb_operations_1790916451581.jpg',
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
    publicUrl: '/src/assets/images/industry_hospitality_1790916463500.jpg',
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
    publicUrl: '/src/assets/images/author_nurcholish_1790919189982.jpg',
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
   * Fetch all registered site media
   */
  async getAllMedia(section?: MediaSection): Promise<SiteMedia[]> {
    if (!isSupabaseConfigured) {
      try {
        const raw = localStorage.getItem(LOCAL_MEDIA_KEY);
        if (raw) {
          const list: SiteMedia[] = JSON.parse(raw);
          return section ? list.filter((m) => m.section === section) : list;
        }
      } catch {}
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
        // If public_url is not an absolute HTTP URL, construct it from Supabase Storage
        if (!publicUrl.startsWith('http')) {
          const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(d.storage_path);
          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
          }
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
    return list.find((m) => m.slug === slug && m.active) || null;
  },

  /**
   * Upload image file to Supabase Storage and register in site_media table
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
      // In offline / local demo mode, create local object URL or data URL
      const fallbackUrl = URL.createObjectURL(file);
      const newMedia: SiteMedia = {
        id: `med-${timestamp}`,
        name: metadata.name || file.name.split('.')[0],
        slug: metadata.slug || `media-${timestamp}`,
        description: metadata.description || '',
        storagePath,
        publicUrl: fallbackUrl,
        mediaType: file.type,
        altText: metadata.altText || metadata.name || '',
        section: metadata.section || 'general',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const current = await this.getAllMedia();
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify([newMedia, ...current]));
      return { media: newMedia, publicUrl: fallbackUrl, error: null };
    }

    try {
      // 1. Upload to Supabase Storage bucket 'aruna-media'
      const { data: storageData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { media: null, publicUrl: '', error: uploadError };
      }

      // 2. Get Public URL
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
   * Replace existing media file
   */
  async replaceMedia(id: string, file: File): Promise<{ publicUrl: string; error: Error | null }> {
    const list = await this.getAllMedia();
    const existing = list.find((m) => m.id === id);
    if (!existing) {
      return { publicUrl: '', error: new Error('Media tidak ditemukan.') };
    }

    if (!isSupabaseConfigured) {
      const newUrl = URL.createObjectURL(file);
      existing.publicUrl = newUrl;
      existing.updatedAt = new Date().toISOString();
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(list));
      return { publicUrl: newUrl, error: null };
    }

    try {
      // Overwrite file at same storage path or new path
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
   * Update metadata for media
   */
  async updateMetadata(
    id: string,
    updates: Partial<Pick<SiteMedia, 'name' | 'slug' | 'description' | 'altText' | 'section' | 'active'>>
  ): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      const list = await this.getAllMedia();
      const updated = list.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(updated));
      return { error: null };
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
   * Delete media item safely
   */
  async deleteMedia(id: string): Promise<{ error: Error | null }> {
    const list = await this.getAllMedia();
    const media = list.find((m) => m.id === id);
    if (!media) return { error: null };

    if (!isSupabaseConfigured) {
      const updated = list.filter((m) => m.id !== id);
      localStorage.setItem(LOCAL_MEDIA_KEY, JSON.stringify(updated));
      return { error: null };
    }

    try {
      // 1. Delete from storage
      await supabase.storage.from(BUCKET_NAME).remove([media.storagePath]);

      // 2. Delete record from table
      const { error } = await supabase.from('site_media').delete().eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },
};
