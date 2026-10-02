import { Article, ArticleCategory, Author } from '../types';
import { INITIAL_ARTICLES, INITIAL_AUTHORS } from '../data/initialArticles';

const ARTICLES_STORAGE_KEY = 'aruna_insights_articles_v3';
const AUTHORS_STORAGE_KEY = 'aruna_insights_authors_v3';

// In-memory fallback and reactive listener system
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying insights listener:', e);
    }
  });
}

export function subscribeToInsights(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getStoredArticles(): Article[] {
  if (typeof window === 'undefined') return INITIAL_ARTICLES;
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ARTICLES;
  } catch (err) {
    console.error('Failed to read articles from localStorage:', err);
    return INITIAL_ARTICLES;
  }
}

function persistArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    notifyListeners();
  } catch (err) {
    console.error('Failed to persist articles:', err);
  }
}

function getStoredAuthors(): Author[] {
  if (typeof window === 'undefined') return INITIAL_AUTHORS;
  try {
    const raw = localStorage.getItem(AUTHORS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(INITIAL_AUTHORS));
      return INITIAL_AUTHORS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_AUTHORS;
  } catch (err) {
    console.error('Failed to read authors from localStorage:', err);
    return INITIAL_AUTHORS;
  }
}

function persistAuthors(authors: Author[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(authors));
    notifyListeners();
  } catch (err) {
    console.error('Failed to persist authors:', err);
  }
}

/* ================= PUBLIC ACCESS METHODS ================= */

export const InsightsService = {
  // Public articles: ONLY status === 'published'
  getPublishedArticles(filter?: {
    category?: string;
    search?: string;
    authorId?: string;
  }): Article[] {
    const all = getStoredArticles();
    const authors = getStoredAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return all
      .filter((a) => a.status === 'published')
      .map((a) => ({ ...a, author: authorMap.get(a.authorId) }))
      .filter((article) => {
        if (filter?.category && filter.category !== 'ALL' && article.category !== filter.category) {
          return false;
        }
        if (filter?.authorId && article.authorId !== filter.authorId) {
          return false;
        }
        if (filter?.search && filter.search.trim()) {
          const q = filter.search.toLowerCase().trim();
          const matchTitle = article.title.toLowerCase().includes(q);
          const matchExcerpt = article.excerpt.toLowerCase().includes(q);
          const matchCategory = article.category.toLowerCase().includes(q);
          const matchContent = article.content.toLowerCase().includes(q);
          if (!matchTitle && !matchExcerpt && !matchCategory && !matchContent) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  },

  getArticleBySlug(slug: string, allowDraft = false): Article | null {
    const all = getStoredArticles();
    const authors = getStoredAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const found = all.find((a) => a.slug === slug);
    if (!found) return null;
    if (!allowDraft && found.status !== 'published') return null;

    return {
      ...found,
      author: authorMap.get(found.authorId),
    };
  },

  getArticleById(id: string): Article | null {
    const all = getStoredArticles();
    const authors = getStoredAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    const found = all.find((a) => a.id === id);
    if (!found) return null;

    return {
      ...found,
      author: authorMap.get(found.authorId),
    };
  },

  getFeaturedArticles(): Article[] {
    return this.getPublishedArticles().filter((a) => a.featured);
  },

  getRecentArticles(limit = 6): Article[] {
    return this.getPublishedArticles().slice(0, limit);
  },

  getRelatedArticles(currentId: string, category: string, limit = 3): Article[] {
    const published = this.getPublishedArticles();
    return published
      .filter((a) => a.id !== currentId && a.category === category)
      .slice(0, limit);
  },

  getCategoriesWithCount(): { category: ArticleCategory; count: number }[] {
    const categories: ArticleCategory[] = [
      'OPINION',
      'BUSINESS',
      'ERP & TECHNOLOGY',
      'INDUSTRY',
      'FIELD NOTES',
    ];
    const published = this.getPublishedArticles();

    return categories.map((cat) => ({
      category: cat,
      count: published.filter((a) => a.category === cat).length,
    }));
  },

  getAuthors(): Author[] {
    return getStoredAuthors();
  },

  getAuthorById(id: string): Author | null {
    return getStoredAuthors().find((a) => a.id === id) || null;
  },

  getAuthorArticles(authorId: string): Article[] {
    return this.getPublishedArticles({ authorId });
  },

  /* ================= ADMIN / CMS METHODS ================= */

  getAllArticlesForAdmin(): Article[] {
    const all = getStoredArticles();
    const authors = getStoredAuthors();
    const authorMap = new Map(authors.map((a) => [a.id, a]));

    return all
      .map((a) => ({ ...a, author: authorMap.get(a.authorId) }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  saveArticle(
    articleData: Omit<Article, 'createdAt' | 'updatedAt' | 'author' | 'id'> & {
      id?: string;
    }
  ): Article {
    const all = getStoredArticles();
    const now = new Date().toISOString();

    if (articleData.id) {
      // Update existing
      const index = all.findIndex((a) => a.id === articleData.id);
      if (index >= 0) {
        const existing = all[index];
        const updated: Article = {
          ...existing,
          ...articleData,
          id: existing.id,
          createdAt: existing.createdAt,
          updatedAt: now,
          readingTime:
            articleData.readingTime ||
            Math.max(1, Math.round(articleData.content.split(/\s+/).length / 200)),
        };
        all[index] = updated;
        persistArticles(all);
        return updated;
      }
    }

    // Create new
    const newId = `art-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newArticle: Article = {
      ...articleData,
      id: newId,
      slug:
        articleData.slug ||
        articleData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      createdAt: now,
      updatedAt: now,
      publishedAt:
        articleData.status === 'published'
          ? articleData.publishedAt || now.substring(0, 10)
          : articleData.publishedAt,
      readingTime:
        articleData.readingTime ||
        Math.max(1, Math.round(articleData.content.split(/\s+/).length / 200)),
    };

    all.unshift(newArticle);
    persistArticles(all);
    return newArticle;
  },

  toggleArticleStatus(id: string): Article | null {
    const all = getStoredArticles();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const current = all[index];
    const newStatus = current.status === 'published' ? 'draft' : 'published';
    const now = new Date().toISOString();

    const updated: Article = {
      ...current,
      status: newStatus,
      updatedAt: now,
      publishedAt:
        newStatus === 'published' && !current.publishedAt
          ? now.substring(0, 10)
          : current.publishedAt,
    };

    all[index] = updated;
    persistArticles(all);
    return updated;
  },

  toggleArticleFeatured(id: string): Article | null {
    const all = getStoredArticles();
    const index = all.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updated: Article = {
      ...all[index],
      featured: !all[index].featured,
      updatedAt: new Date().toISOString(),
    };

    all[index] = updated;
    persistArticles(all);
    return updated;
  },

  deleteArticle(id: string): boolean {
    const all = getStoredArticles();
    const filtered = all.filter((a) => a.id !== id);
    if (filtered.length === all.length) return false;

    persistArticles(filtered);
    return true;
  },

  resetToInitial(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(INITIAL_ARTICLES));
    localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(INITIAL_AUTHORS));
    notifyListeners();
  },
};
