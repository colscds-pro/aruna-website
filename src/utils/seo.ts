/**
 * Helper to dynamically synchronize SEO, OpenGraph, and Twitter card tags
 * in the document head during client-side SPA transitions.
 */

export interface SeoMetadata {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  authorName?: string;
  publishedTime?: string;
}

export function updatePageSeo(meta: SeoMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Update Document Title
  document.title = meta.title;

  // 2. Helper to set or create meta tag
  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper for link canonical
  const setCanonical = (href: string) => {
    let el = document.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  // Base URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aruna-consulting.vercel.app';
  const resolvedUrl = meta.url ? (meta.url.startsWith('http') ? meta.url : `${origin}${meta.url}`) : window.location.href;

  // Standard Meta
  setMeta('name', 'description', meta.description);
  setCanonical(resolvedUrl);

  // Open Graph / Facebook / WhatsApp
  setMeta('property', 'og:site_name', 'ARUNA');
  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', resolvedUrl);

  if (meta.image) {
    const resolvedImage = meta.image.startsWith('http')
      ? meta.image
      : `${origin}${meta.image.startsWith('/') ? '' : '/'}${meta.image}`;

    setMeta('property', 'og:image', resolvedImage);
    setMeta('property', 'og:image:secure_url', resolvedImage);
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:alt', meta.title);

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', resolvedImage);
  }

  // Article specific
  if (meta.type === 'article' && meta.publishedTime) {
    setMeta('property', 'article:published_time', meta.publishedTime);
  }
  if (meta.authorName) {
    setMeta('property', 'article:author', meta.authorName);
  }
}
