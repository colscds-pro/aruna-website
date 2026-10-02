import { supabase, isSupabaseConfigured } from './client';
import { Category } from '../../types';

export const INITIAL_CATEGORIES_DATA: Category[] = [
  { id: 'cat-opinion', name: 'OPINION', slug: 'opinion', description: 'Pandangan strategis mengenai tata kelola dan filosofi bisnis.', active: true },
  { id: 'cat-business', name: 'BUSINESS', slug: 'business', description: 'Analisis skalabilitas, ekspansi cabang, dan dinamika margin.', active: true },
  { id: 'cat-erp', name: 'ERP & TECHNOLOGY', slug: 'erp-technology', description: 'Implementasi sistem, arsitektur data, dan integrasi modul.', active: true },
  { id: 'cat-industry', name: 'INDUSTRY', slug: 'industry', description: 'Konteks lapangan sektor Retail, F&B, dan Hospitality.', active: true },
  { id: 'cat-field', name: 'FIELD NOTES', slug: 'field-notes', description: 'Catatan observasi langsung dari lantai toko dan gudang.', active: true },
];

export const CategoriesService = {
  /**
   * Get categories from public.categories table
   * Public visitors receive active=true categories per RLS
   */
  async getCategories(onlyActive = false): Promise<Category[]> {
    if (!isSupabaseConfigured) {
      return onlyActive ? INITIAL_CATEGORIES_DATA.filter((c) => c.active) : INITIAL_CATEGORIES_DATA;
    }

    try {
      let query = supabase.from('categories').select('*').order('name');
      if (onlyActive) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return onlyActive ? INITIAL_CATEGORIES_DATA.filter((c) => c.active) : INITIAL_CATEGORIES_DATA;
      }

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        active: d.active,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));
    } catch {
      return onlyActive ? INITIAL_CATEGORIES_DATA.filter((c) => c.active) : INITIAL_CATEGORIES_DATA;
    }
  },

  /**
   * Create category in Supabase public.categories
   */
  async createCategory(
    cat: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<{ category: Category | null; error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { category: null, error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          active: cat.active ?? true,
        })
        .select()
        .single();

      if (error) return { category: null, error };
      return {
        category: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          active: data.active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        },
        error: null,
      };
    } catch (err: any) {
      return { category: null, error: err };
    }
  },

  /**
   * Update category in Supabase public.categories
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.active !== undefined) payload.active = updates.active;

      const { error } = await supabase.from('categories').update(payload).eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Delete category from Supabase public.categories
   */
  async deleteCategory(id: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },
};
