import { useState, useEffect } from 'react';
import { MediaService } from './mediaService';

// In-memory cache for media slugs
const mediaCache = new Map<string, string>();

/**
 * Hook to retrieve managed site media image URL by slug with instant fallback
 * @param slug Media identifier (e.g. 'hero-consulting-meeting', 'industry-retail')
 * @param fallbackUrl Static bundled asset path
 */
export function useSiteMedia(slug: string, fallbackUrl: string): { url: string; altText: string; isLoading: boolean } {
  const [url, setUrl] = useState<string>(mediaCache.get(slug) || fallbackUrl);
  const [altText, setAltText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(!mediaCache.has(slug));

  useEffect(() => {
    let isMounted = true;

    async function loadMedia() {
      try {
        const media = await MediaService.getMediaBySlug(slug);
        if (isMounted && media && media.publicUrl) {
          mediaCache.set(slug, media.publicUrl);
          setUrl(media.publicUrl);
          if (media.altText) setAltText(media.altText);
        }
      } catch (err) {
        // Silently retain fallbackUrl
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMedia();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { url, altText, isLoading };
}
