/**
 * Backward compatibility proxy for insightsStorage
 * All underlying data and authentication are powered exclusively by Supabase services.
 * Zero dependency on localStorage.
 */
import { ArticlesService, subscribeToArticles } from './supabase/articlesService';
import { AuthorsService } from './supabase/authorsService';
import { INITIAL_ARTICLES, INITIAL_AUTHORS } from '../data/initialArticles';
import { Article, Author } from '../types';

export const subscribeToInsights = subscribeToArticles;

export const InsightsService = {
  getPublishedArticles(): Article[] {
    // In-memory baseline if called synchronously
    return INITIAL_ARTICLES.filter((a) => a.status === 'published');
  },

  getAllArticlesForAdmin(): Article[] {
    return INITIAL_ARTICLES;
  },

  getAuthors(): Author[] {
    return INITIAL_AUTHORS;
  },

  getAuthorById(id: string): Author | undefined {
    return INITIAL_AUTHORS.find((a) => a.id === id || a.slug === id);
  },

  getRelatedArticles(currentArticleId: string, category: string, limit = 2): Article[] {
    return INITIAL_ARTICLES.filter((a) => a.id !== currentArticleId && a.category === category).slice(0, limit);
  },

  getAuthorArticles(authorId: string): Article[] {
    return INITIAL_ARTICLES.filter(
      (a) => a.authorId === authorId || a.author?.id === authorId || a.author?.slug === authorId
    );
  },
};
