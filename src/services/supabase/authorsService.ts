import { supabase, isSupabaseConfigured } from './client';
import { Author } from '../../types';
import { INITIAL_AUTHORS } from '../../data/initialArticles';
import { MediaService } from './mediaService';
import { BUNDLED_IMAGES } from '../../assets/bundledImages';

export const AuthorsService = {
  /**
   * Get authors from public.authors table
   * Public visitors receive active=true authors per RLS
   */
  async getAuthors(onlyActive = false): Promise<Author[]> {
    if (!isSupabaseConfigured) {
      return onlyActive ? INITIAL_AUTHORS.filter((a) => a.active !== false) : INITIAL_AUTHORS;
    }

    try {
      let query = supabase.from('authors').select('*').order('name');
      if (onlyActive) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return onlyActive ? INITIAL_AUTHORS.filter((a) => a.active !== false) : INITIAL_AUTHORS;
      }

      return data.map((d) => {
        const resolvedPhotoUrl = d.avatar_url
          ? MediaService.resolveStorageUrl(d.avatar_url, 'author')
          : BUNDLED_IMAGES.authorNurcholish;

        return {
          id: d.id,
          name: d.name,
          slug: d.slug,
          role: 'Founder, ARUNA',
          bio: d.bio,
          photoUrl: resolvedPhotoUrl,
          avatarUrl: d.avatar_url,
          active: d.active,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        };
      });
    } catch {
      return onlyActive ? INITIAL_AUTHORS.filter((a) => a.active !== false) : INITIAL_AUTHORS;
    }
  },

  async getAuthorById(id: string): Promise<Author | null> {
    const list = await this.getAuthors(false);
    return list.find((a) => a.id === id || a.slug === id) || null;
  },

  /**
   * Create author in Supabase public.authors
   */
  async createAuthor(
    author: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ author: Author | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { author: null, error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const { data, error } = await supabase
        .from('authors')
        .insert({
          name: author.name,
          slug: author.slug || author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          bio: author.bio,
          avatar_url: author.avatarUrl || author.photoUrl,
          active: author.active ?? true,
        })
        .select()
        .single();

      if (error) return { author: null, error };
      return {
        author: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          role: author.role || 'Author',
          bio: data.bio,
          photoUrl: data.avatar_url
            ? MediaService.resolveStorageUrl(data.avatar_url, 'author')
            : (author.photoUrl || BUNDLED_IMAGES.authorNurcholish),
          avatarUrl: data.avatar_url,
          active: data.active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      };
    } catch (err: any) {
      return { author: null, error: err };
    }
  },

  /**
   * Update author in Supabase public.authors
   */
  async updateAuthor(id: string, updates: Partial<Author>): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.bio !== undefined) payload.bio = updates.bio;
      if (updates.photoUrl !== undefined || updates.avatarUrl !== undefined) {
        payload.avatar_url = updates.avatarUrl || updates.photoUrl;
      }
      if (updates.active !== undefined) payload.active = updates.active;

      const { error } = await supabase.from('authors').update(payload).eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Delete author from Supabase public.authors
   */
  async deleteAuthor(id: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const { error } = await supabase.from('authors').delete().eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },
};
