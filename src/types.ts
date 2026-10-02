export type Language = 'id' | 'en';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  outcome: string;
  description: string;
  deliverables: string[];
  isFuture?: boolean;
}

export interface MethodologyStage {
  stage: string;
  name: string;
  description: string;
  action: string;
  output: string;
}

export interface ImplementationStep {
  step: number;
  title: string;
  summary: string;
  detail: string;
}

export interface IndustryItem {
  id: 'retail' | 'fb' | 'hospitality';
  name: string;
  headline: string;
  description: string;
  frictionPoints: string[];
  systemFocus: string[];
  imageSrc: string;
}

export interface DiagnosticQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    label: string;
    score: number; // 1 (vulnerable) to 3 (ready)
    description: string;
  }[];
}

export type ArticleCategory =
  | 'OPINION'
  | 'BUSINESS'
  | 'ERP & TECHNOLOGY'
  | 'INDUSTRY'
  | 'FIELD NOTES'
  | string;

export interface Profile {
  id: string;
  fullName: string;
  role: 'admin' | 'editor';
  createdAt?: string;
  updatedAt?: string;
}

export interface Author {
  id: string;
  name: string;
  slug?: string;
  role: string;
  bio: string;
  photoUrl: string; // compatibility with existing UI
  avatarUrl?: string; // supabase field mapping
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string; // compatibility with existing UI
  coverImageUrl?: string | null; // supabase field mapping
  category: ArticleCategory;
  categoryId?: string | null;
  authorId: string;
  author?: Author;
  status: 'draft' | 'published';
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number;
}

export type MediaSection = 'hero' | 'industry' | 'case-study' | 'about' | 'general' | 'insights';

export interface SiteMedia {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  storagePath: string;
  publicUrl: string;
  mediaType: string;
  altText?: string | null;
  section: MediaSection;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
