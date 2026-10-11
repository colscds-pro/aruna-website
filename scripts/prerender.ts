import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ARTICLES, INITIAL_AUTHORS } from '../src/data/initialArticles';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

// Production base URL for canonical and absolute OpenGraph links
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

function resolveOgImage(articleSlug: string, coverImageUrl?: string | null): string {
  // Map known article slugs to guaranteed static, unhashed 1200x630 JPEG images in /public
  if (articleSlug.includes('erp')) {
    return `${BASE_URL}/og-erp-foundation.jpg`;
  }
  if (articleSlug.includes('cabang') || articleSlug.includes('branch')) {
    return `${BASE_URL}/og-second-branch.jpg`;
  }
  if (articleSlug.includes('sop') || articleSlug.includes('retail')) {
    return `${BASE_URL}/og-retail.jpg`;
  }
  if (articleSlug.includes('proses') || articleSlug.includes('fb') || articleSlug.includes('fnb')) {
    return `${BASE_URL}/og-fb.jpg`;
  }
  if (coverImageUrl && (coverImageUrl.startsWith('http://') || coverImageUrl.startsWith('https://'))) {
    return coverImageUrl;
  }
  return `${BASE_URL}/og-aruna-default.jpg`;
}

function replaceMetaTags(
  html: string,
  opts: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
    ogType?: string;
    authorName?: string;
    publishedDate?: string;
  }
): string {
  const safeTitle = escapeHtml(opts.title);
  const safeDesc = escapeHtml(opts.description);
  const safeCanonical = escapeHtml(opts.canonicalUrl);
  const safeImage = escapeHtml(opts.ogImage);
  const ogType = opts.ogType || 'website';

  let result = html;

  // Replace Title
  result = result.replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`);

  // Replace or inject meta description
  if (result.includes('<meta name="description"')) {
    result = result.replace(
      /<meta name="description"[^>]*>/i,
      `<meta name="description" content="${safeDesc}" />`
    );
  } else {
    result = result.replace('</head>', `  <meta name="description" content="${safeDesc}" />\n</head>`);
  }

  // Canonical tag
  if (result.includes('<link rel="canonical"')) {
    result = result.replace(
      /<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${safeCanonical}" />`
    );
  } else {
    result = result.replace('</head>', `  <link rel="canonical" href="${safeCanonical}" />\n</head>`);
  }

  // Open Graph tags block
  const ogBlock = `
    <!-- Open Graph / WhatsApp / Facebook Preview -->
    <meta property="og:site_name" content="ARUNA" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:url" content="${safeCanonical}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${safeTitle}" />
    ${opts.publishedDate ? `<meta property="article:published_time" content="${opts.publishedDate}" />` : ''}
    ${opts.authorName ? `<meta property="article:author" content="${escapeHtml(opts.authorName)}" />` : ''}

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImage}" />
  `;

  // Remove existing OG and twitter tags to prevent duplicates
  result = result.replace(/<meta property="og:[^>]*>/gi, '');
  result = result.replace(/<meta name="twitter:[^>]*>/gi, '');

  result = result.replace('</head>', `${ogBlock}\n</head>`);

  return result;
}

export async function prerender() {
  console.log('--- ARUNA PRERENDER PIPELINE START ---');
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Error: ${indexHtmlPath} not found. Run "vite build" first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Prerender root index.html with canonical & default OG tags
  const rootHtml = replaceMetaTags(baseHtml, {
    title: 'ARUNA — Business Transformation & ERP Consulting | Make Business Make Sense',
    description: 'ARUNA membantu pemilik bisnis retail, F&B, dan hospitality memahami, merapikan, dan mengontrol operasional melalui proses bisnis terstruktur dan teknologi ERP.',
    canonicalUrl: `${BASE_URL}/`,
    ogImage: `${BASE_URL}/og-aruna-default.jpg`,
    ogType: 'website',
  });
  fs.writeFileSync(indexHtmlPath, rootHtml, 'utf8');
  console.log(`✓ Prerendered root /index.html`);

  // 2. Prerender /insights (Listing Page)
  const insightsDir = path.join(DIST_DIR, 'insights');
  if (!fs.existsSync(insightsDir)) {
    fs.mkdirSync(insightsDir, { recursive: true });
  }
  const insightsHtml = replaceMetaTags(baseHtml, {
    title: 'Insights & Telaah Operasional Bisnis | ARUNA',
    description: 'Kajian mendalam mengenai arsitektur proses, kontrol margin, mitigasi kebocoran persediaan, dan kesiapan sistem sebelum ekspansi cabang ritel dan F&B.',
    canonicalUrl: `${BASE_URL}/insights`,
    ogImage: `${BASE_URL}/og-aruna-default.jpg`,
    ogType: 'website',
  });
  fs.writeFileSync(path.join(insightsDir, 'index.html'), insightsHtml, 'utf8');
  console.log(`✓ Prerendered /insights/index.html`);

  // 3. Prerender each published article detail page
  const publishedArticles = INITIAL_ARTICLES.filter((a) => a.status === 'published');
  for (const article of publishedArticles) {
    const articleDir = path.join(insightsDir, article.slug);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const ogImage = resolveOgImage(article.slug, article.coverImageUrl || article.coverImage);
    const articleHtml = replaceMetaTags(baseHtml, {
      title: `${article.title} | ARUNA Insights`,
      description: article.seoDescription || article.excerpt,
      canonicalUrl: `${BASE_URL}/insights/${article.slug}`,
      ogImage,
      ogType: 'article',
      authorName: 'Muhammad Nurcholish',
      publishedDate: article.publishedAt,
    });

    fs.writeFileSync(path.join(articleDir, 'index.html'), articleHtml, 'utf8');
    console.log(`✓ Prerendered article /insights/${article.slug}/index.html (OG Image: ${ogImage})`);
  }

  // 4. Prerender author archive pages
  const authorsDir = path.join(DIST_DIR, 'authors');
  if (!fs.existsSync(authorsDir)) {
    fs.mkdirSync(authorsDir, { recursive: true });
  }

  for (const author of INITIAL_AUTHORS) {
    const slug = author.slug || author.id;
    const authorDir = path.join(authorsDir, slug);
    if (!fs.existsSync(authorDir)) {
      fs.mkdirSync(authorDir, { recursive: true });
    }

    const authorHtml = replaceMetaTags(baseHtml, {
      title: `${author.name} — Penulis & Kontributor | ARUNA Insights`,
      description: `Kumpulan artikel, catatan lapangan, dan analisis operasional bisnis oleh ${author.name} di ARUNA Insights.`,
      canonicalUrl: `${BASE_URL}/authors/${slug}`,
      ogImage: `${BASE_URL}/og-author-nurcholish.jpg`,
      ogType: 'profile',
      authorName: author.name,
    });

    fs.writeFileSync(path.join(authorDir, 'index.html'), authorHtml, 'utf8');
    console.log(`✓ Prerendered author /authors/${slug}/index.html`);
  }

  console.log('--- ARUNA PRERENDER PIPELINE COMPLETE ---');
}

prerender().catch((err) => {
  console.error('Prerender error:', err);
  process.exit(1);
});
