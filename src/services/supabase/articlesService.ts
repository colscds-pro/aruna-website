import { supabase, isSupabaseConfigured } from './client';
import { Article } from '../../types';
import { INITIAL_ARTICLES } from '../../data/initialArticles';
import { AuthorsService } from './authorsService';
import { CategoriesService } from './categoriesService';

// Listener system for reactive UI updates across components
type Listener = () => void;
const listeners = new Set<Listener>();

function notifySubscribers() {
  listeners.forEach((l) => {
    try {
      l();
    } catch {}
  });
}

export function subscribeToArticles(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export const ArticlesService = {
  /**
   * Get all published articles for public visitors from public.articles
   * Respects RLS: anonymous and authenticated users receive status='published' only
   */
  async getPublishedArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_ARTICLES.filter((a) => a.status === 'published');
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching published articles from Supabase:', error.message);
        return INITIAL_ARTICLES.filter((a) => a.status === 'published');
      }

      if (!data || data.length === 0) {
        // Fallback to in-memory initial articles if table hasn't been seeded yet
        return INITIAL_ARTICLES.filter((a) => a.status === 'published');
      }

      return data.map((row) => this.mapDbArticleToModel(row));
    } catch (err) {
      console.error('Exception fetching published articles:', err);
      return INITIAL_ARTICLES.filter((a) => a.status === 'published');
    }
  },

  /**
   * Get all articles (draft + published) for Admin CMS from public.articles
   */
  async getAllArticles(): Promise<Article[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_ARTICLES;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles for admin CMS from Supabase:', error.message);
        return INITIAL_ARTICLES;
      }

      if (!data || data.length === 0) {
        return INITIAL_ARTICLES;
      }

      return data.map((row) => this.mapDbArticleToModel(row));
    } catch (err) {
      console.error('Exception fetching all articles:', err);
      return INITIAL_ARTICLES;
    }
  },

  /**
   * Get single article by slug from public.articles
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (!isSupabaseConfigured) {
      const all = await this.getAllArticles();
      return all.find((a) => a.slug === slug) || null;
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          author:authors(*),
          category:categories(*)
        `)
        .eq('slug', slug)
        .single();

      if (error || !data) {
        const all = await this.getAllArticles();
        return all.find((a) => a.slug === slug) || null;
      }

      return this.mapDbArticleToModel(data);
    } catch {
      const all = await this.getAllArticles();
      return all.find((a) => a.slug === slug) || null;
    }
  },

  /**
   * Get related articles for article modal
   */
  async getRelatedArticles(currentArticleId: string, category: string, limit = 2): Promise<Article[]> {
    const published = await this.getPublishedArticles();
    return published
      .filter((a) => a.id !== currentArticleId && a.category === category)
      .slice(0, limit);
  },

  /**
   * Get all articles by author
   */
  async getAuthorArticles(authorId: string): Promise<Article[]> {
    const published = await this.getPublishedArticles();
    return published.filter(
      (a) => a.authorId === authorId || a.author?.id === authorId || a.author?.slug === authorId
    );
  },

  /**
   * Create new article in Supabase public.articles table
   */
  async createArticle(input: Partial<Article>): Promise<{ article: Article | null; error: Error | null }> {
    const title = input.title?.trim() || 'Untitled Article';
    const baseSlug = input.slug?.trim() || slugifyTitle(title);
    const readingTime = estimateReadingTime(input.content || '');

    if (!isSupabaseConfigured) {
      return {
        article: null,
        error: new Error('Supabase belum terkonfigurasi di environment.'),
      };
    }

    try {
      // Find author and category UUID if needed
      const authors = await AuthorsService.getAuthors(false);
      const categories = await CategoriesService.getCategories(false);

      const matchedAuthor = authors.find((a) => a.id === input.authorId || a.slug === input.authorId);
      const matchedCategory = categories.find((c) => c.name === input.category || c.id === input.categoryId);

      const now = new Date().toISOString();
      const isPublished = input.status === 'published';

      const { data, error } = await supabase
        .from('articles')
        .insert({
          title,
          slug: baseSlug,
          excerpt: input.excerpt || '',
          content: input.content || '',
          cover_image_url: input.coverImageUrl || input.coverImage || null,
          author_id: matchedAuthor?.id || null,
          category_id: matchedCategory?.id || null,
          status: input.status || 'draft',
          featured: input.featured ?? false,
          published_at: isPublished ? (input.publishedAt || now) : null,
        })
        .select(`*, author:authors(*), category:categories(*)`)
        .single();

      if (error) {
        return { article: null, error };
      }

      const created = this.mapDbArticleToModel(data);
      notifySubscribers();
      return { article: created, error: null };
    } catch (err: any) {
      return { article: null, error: err };
    }
  },

  /**
   * Update article in Supabase public.articles table
   */
  async updateArticle(id: string, updates: Partial<Article>): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.coverImage !== undefined || updates.coverImageUrl !== undefined) {
        payload.cover_image_url = updates.coverImageUrl || updates.coverImage;
      }
      if (updates.status !== undefined) {
        payload.status = updates.status;
        if (updates.status === 'published' && !updates.publishedAt) {
          payload.published_at = new Date().toISOString();
        }
      }
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.publishedAt !== undefined) payload.published_at = updates.publishedAt;

      // Handle relations if passed
      if (updates.authorId) {
        const authors = await AuthorsService.getAuthors(false);
        const match = authors.find((a) => a.id === updates.authorId || a.slug === updates.authorId);
        if (match) payload.author_id = match.id;
      }

      if (updates.category) {
        const categories = await CategoriesService.getCategories(false);
        const match = categories.find((c) => c.name === updates.category || c.id === updates.categoryId);
        if (match) payload.category_id = match.id;
      }

      const { error } = await supabase.from('articles').update(payload).eq('id', id);
      if (!error) {
        notifySubscribers();
      }
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Delete article from Supabase public.articles table
   */
  async deleteArticle(id: string): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase belum terkonfigurasi.') };
    }

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) {
        notifySubscribers();
      }
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Publish article
   */
  async publishArticle(id: string): Promise<{ error: Error | null }> {
    return this.updateArticle(id, {
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
  },

  /**
   * Unpublish article
   */
  async unpublishArticle(id: string): Promise<{ error: Error | null }> {
    return this.updateArticle(id, {
      status: 'draft',
    });
  },

  /**
   * Toggle featured status
   */
  async toggleFeatured(id: string, featured: boolean): Promise<{ error: Error | null }> {
    return this.updateArticle(id, { featured });
  },

  /**
   * Helper: map Supabase DB record to Article TypeScript model
   */
  mapDbArticleToModel(row: any): Article {
    const authorData = row.author;
    const categoryData = row.category;

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      coverImage: row.cover_image_url || '/src/assets/images/insight_erp_foundation_1790919206386.jpg',
      coverImageUrl: row.cover_image_url,
      category: categoryData?.name || 'BUSINESS',
      categoryId: row.category_id,
      authorId: row.author_id || authorData?.id || 'muhammad-nurcholish',
      author: authorData
        ? {
            id: authorData.id,
            name: authorData.name,
            slug: authorData.slug,
            role: 'Founder, ARUNA',
            bio: authorData.bio,
            photoUrl: authorData.avatar_url || '/src/assets/images/author_nurcholish_1790919189982.jpg',
            avatarUrl: authorData.avatar_url,
          }
        : undefined,
      status: row.status as 'draft' | 'published',
      featured: Boolean(row.featured),
      publishedAt: row.published_at ? row.published_at.split('T')[0] : '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      seoTitle: `${row.title} | ARUNA Insights`,
      seoDescription: row.excerpt,
      readingTime: estimateReadingTime(row.content || ''),
    };
  },
};
