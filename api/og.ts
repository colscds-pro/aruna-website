import { INITIAL_ARTICLES, INITIAL_AUTHORS } from '../src/data/initialArticles';

/**
 * Vercel Serverless Function: Dynamic OpenGraph Metadata Handler
 * Provides accurate HTML metadata to WhatsApp, Facebook, Twitter, and other crawlers
 * for any article, author, or listing page on Vercel.
 */

const BASE_URL = process.env.APP_URL || process.env.VERCEL_URL
  ? (process.env.APP_URL || `https://${process.env.VERCEL_URL}`).replace(/\/+$/, '')
  : 'https://aruna-consulting.vercel.app';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function resolveOgImage(slug: string): string {
  if (slug.includes('erp')) return `${BASE_URL}/og-erp-foundation.jpg`;
  if (slug.includes('cabang') || slug.includes('branch')) return `${BASE_URL}/og-second-branch.jpg`;
  if (slug.includes('sop') || slug.includes('retail')) return `${BASE_URL}/og-retail.jpg`;
  if (slug.includes('proses') || slug.includes('fb') || slug.includes('fnb')) return `${BASE_URL}/og-fb.jpg`;
  return `${BASE_URL}/og-aruna-default.jpg`;
}

export default async function handler(req: any, res: any) {
  const { slug, type, author } = req.query || {};

  // 1. Author profile page
  if (type === 'author' || author) {
    const authorSlug = (author || slug || 'muhammad-nurcholish') as string;
    const matchedAuthor = INITIAL_AUTHORS.find((a) => a.slug === authorSlug || a.id === authorSlug) || INITIAL_AUTHORS[0];

    const title = `${matchedAuthor.name} — Penulis & Kontributor | ARUNA Insights`;
    const description = `Kumpulan artikel dan telaah operasional bisnis oleh ${matchedAuthor.name} di ARUNA Insights.`;
    const url = `${BASE_URL}/authors/${authorSlug}`;
    const image = `${BASE_URL}/og-author-nurcholish.jpg`;

    return res.status(200).send(renderHtml({ title, description, url, image, type: 'profile' }));
  }

  // 2. Article detail page
  if (slug && slug !== 'insights') {
    const articleSlug = slug as string;
    const article = INITIAL_ARTICLES.find((a) => a.slug === articleSlug);

    const title = article ? `${article.title} | ARUNA Insights` : 'Insights & Analisis Bisnis | ARUNA';
    const description = article ? (article.seoDescription || article.excerpt) : 'Kajian mendalam dan analisis operasional bisnis oleh ARUNA.';
    const url = `${BASE_URL}/insights/${articleSlug}`;
    const image = resolveOgImage(articleSlug);

    return res.status(200).send(renderHtml({ title, description, url, image, type: 'article' }));
  }

  // 3. Insights listing page
  if (type === 'insights' || req.url?.includes('/insights')) {
    const title = 'Insights & Telaah Operasional Bisnis | ARUNA';
    const description = 'Kajian mendalam mengenai arsitektur proses, kontrol margin, mitigasi kebocoran persediaan, dan kesiapan sistem sebelum ekspansi cabang.';
    const url = `${BASE_URL}/insights`;
    const image = `${BASE_URL}/og-aruna-default.jpg`;

    return res.status(200).send(renderHtml({ title, description, url, image, type: 'website' }));
  }

  // 4. Default Homepage
  const title = 'ARUNA — Business Transformation & ERP Consulting | Make Business Make Sense';
  const description = 'ARUNA membantu pemilik bisnis retail, F&B, dan hospitality memahami, merapikan, dan mengontrol operasional melalui proses bisnis terstruktur dan teknologi ERP.';
  const url = `${BASE_URL}/`;
  const image = `${BASE_URL}/og-aruna-default.jpg`;

  return res.status(200).send(renderHtml({ title, description, url, image, type: 'website' }));
}

function renderHtml(meta: {
  title: string;
  description: string;
  url: string;
  image: string;
  type: string;
}) {
  const safeTitle = escapeHtml(meta.title);
  const safeDesc = escapeHtml(meta.description);
  const safeUrl = escapeHtml(meta.url);
  const safeImage = escapeHtml(meta.image);

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${safeUrl}" />

  <!-- Open Graph / WhatsApp / Facebook Preview -->
  <meta property="og:site_name" content="ARUNA" />
  <meta property="og:type" content="${meta.type}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="${safeUrl}" />
  <meta property="og:image" content="${safeImage}" />
  <meta property="og:image:secure_url" content="${safeImage}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${safeTitle}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${safeImage}" />

  <meta http-equiv="refresh" content="0; url=${safeUrl}" />
</head>
<body style="font-family: sans-serif; padding: 2rem; background: #FFFFFF; color: #0B1F33;">
  <h1>${safeTitle}</h1>
  <p>${safeDesc}</p>
  <p><a href="${safeUrl}">Klik di sini jika peramban tidak mengarahkan secara otomatis...</a></p>
</body>
</html>`;
}
