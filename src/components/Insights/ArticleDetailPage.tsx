import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  BookOpen,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Article, Author, Language } from '../../types';
import { ArticlesService } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { BUNDLED_IMAGES, getBundledFallback } from '../../assets/bundledImages';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ConsultationModal } from '../ConsultationModal';
import { updatePageSeo } from '../../utils/seo';

interface ArticleDetailPageProps {
  slug: string;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (path: string) => void;
  onOpenCms: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  lang,
  onLanguageChange,
  onNavigate,
  onOpenCms,
}) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setImgError(false);

    const loadArticleData = async () => {
      try {
        // Only published articles are accessible to public visitors
        const fetchedArticle = await ArticlesService.getPublishedArticleBySlug(slug);

        if (!isMounted) return;

        if (!fetchedArticle || fetchedArticle.status !== 'published') {
          setArticle(null);
          setIsLoading(false);
          document.title = 'Artikel Tidak Ditemukan | ARUNA Insights';
          return;
        }

        setArticle(fetchedArticle);

        // Fetch author
        if (fetchedArticle.author) {
          setAuthor(fetchedArticle.author);
        } else if (fetchedArticle.authorId) {
          const fetchedAuthor = await AuthorsService.getAuthorById(fetchedArticle.authorId);
          if (isMounted && fetchedAuthor) {
            setAuthor(fetchedAuthor);
          }
        }

        // Fetch related articles (published only)
        const related = await ArticlesService.getRelatedArticles(
          fetchedArticle.id,
          fetchedArticle.category,
          3
        );
        if (isMounted) {
          setRelatedArticles(related);
        }

        // Dynamic Document Meta and SEO
        updatePageSeo({
          title: `${fetchedArticle.title} | ARUNA Insights`,
          description: fetchedArticle.seoDescription || fetchedArticle.excerpt,
          url: `/insights/${fetchedArticle.slug}`,
          image: fetchedArticle.coverImage || '/og-aruna-default.jpg',
          type: 'article',
          authorName: fetchedArticle.author?.name || 'Muhammad Nurcholish',
          publishedTime: fetchedArticle.publishedAt,
        });
      } catch (err) {
        console.error('Failed to load article detail:', err);
        if (isMounted) {
          setArticle(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          window.scrollTo(0, 0);
        }
      }
    };

    loadArticleData();

    return () => {
      isMounted = false;
      // Reset document title on unmount
      document.title = 'ARUNA — Business Transformation & ERP Consulting | Make Business Make Sense';
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (!article) return;
    const authorName = author?.name || 'ARUNA';
    const text = encodeURIComponent(
      `Artikel menarik dari ARUNA Insights: "${article.title}" oleh ${authorName}.\nBaca di sini: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Helper to render rich markdown-like paragraphs, headers, blockquotes, lists, and links
  const renderFormattedContent = (raw: string) => {
    const blocks = raw.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Horizontal separator
      if (trimmed === '---') {
        return <hr key={idx} className="my-10 border-t border-[#EAECF0]" />;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold text-[#0B1F33] tracking-tight mt-10 mb-4"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight mt-12 mb-6 pt-4 border-t border-[#EAECF0]"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^> \**|\**$/g, '').replace(/^> /g, '');
        return (
          <blockquote
            key={idx}
            className="p-6 sm:p-7 my-8 rounded-r-xl bg-[#F5F6F7] border-l-4 border-[#B59A5A] text-base sm:text-lg font-medium text-[#0B1F33] italic leading-relaxed shadow-xs"
          >
            {quoteText}
          </blockquote>
        );
      }

      // Numbered or Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n');
        const isNumbered = /^\d+\.\s/.test(trimmed);

        if (isNumbered) {
          return (
            <ol key={idx} className="space-y-3 my-6 pl-2 list-none">
              {lines.map((line, lIdx) => {
                const match = line.match(/^(\d+)\.\s*(.*)/);
                const num = match ? match[1] : `${lIdx + 1}`;
                const text = match ? match[2] : line;
                return (
                  <li key={lIdx} className="text-base sm:text-lg text-[#0B1F33]/90 leading-relaxed flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B1F33] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {num}
                    </span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        return (
          <ul key={idx} className="space-y-2.5 my-6 pl-2 list-none">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="text-base sm:text-lg text-[#0B1F33]/90 leading-relaxed flex items-start gap-3">
                <span className="text-[#B59A5A] font-bold text-xl leading-none mt-1">·</span>
                <span>{line.replace(/^[-*]\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-[#0B1F33]/90 leading-relaxed mb-6 font-normal"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0B1F33]">
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={onLanguageChange}
        onOpenConsultation={() => setIsConsultModalOpen(true)}
        onOpenCms={onOpenCms}
      />

      <main className="flex-1">
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto px-6 py-20 animate-pulse">
            <div className="h-4 bg-[#EAECF0] rounded w-36 mb-6" />
            <div className="h-10 bg-[#EAECF0] rounded w-3/4 mb-4" />
            <div className="h-5 bg-[#EAECF0] rounded w-full mb-8" />
            <div className="aspect-[16/9] bg-[#EAECF0] rounded-2xl mb-10" />
            <div className="space-y-4">
              <div className="h-4 bg-[#EAECF0] rounded w-full" />
              <div className="h-4 bg-[#EAECF0] rounded w-5/6" />
              <div className="h-4 bg-[#EAECF0] rounded w-4/6" />
            </div>
          </div>
        )}

        {/* 404 / Article Not Found State */}
        {!isLoading && !article && (
          <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F6F7] border border-[#EAECF0] flex items-center justify-center mx-auto mb-6 text-[#667085]">
              <AlertCircle className="w-8 h-8 text-[#B59A5A]" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-2">
              404 — KONTEN TIDAK DITEMUKAN
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] mb-4">
              Artikel Tidak Ditemukan
            </h1>
            <p className="text-base text-[#667085] leading-relaxed max-w-lg mx-auto mb-8">
              Artikel yang Anda cari tidak tersedia, berstatus draft yang belum dipublikasikan, atau tautan telah berpindah.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/#insights')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar Insights</span>
            </button>
          </div>
        )}

        {/* Dedicated Article Content */}
        {!isLoading && article && (
          <article className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-6">
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#0B1F33] transition-colors cursor-pointer"
                >
                  Beranda
                </button>
                <span>/</span>
                <button
                  type="button"
                  onClick={() => onNavigate('/insights')}
                  className="hover:text-[#0B1F33] transition-colors cursor-pointer"
                >
                  Insights
                </button>
                <span>/</span>
                <span className="text-[#0B1F33] font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {article.category}
                </span>
              </div>

              {/* Back to Insights Navigation & Category Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EAECF0]">
                <button
                  type="button"
                  onClick={() => onNavigate('/insights')}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#667085] hover:text-[#0B1F33] transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Kembali ke Insights</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-md bg-[#0B1F33] text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                  <span className="text-xs text-[#667085] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTime} min read
                  </span>
                </div>
              </div>

              {/* Title & Standfirst */}
              <header className="mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1F33] leading-tight tracking-tight mb-6 text-balance">
                  {article.title}
                </h1>

                <p className="text-lg sm:text-xl text-[#667085] leading-relaxed font-normal mb-8">
                  {article.excerpt}
                </p>

                {/* Author Byline & Social Share Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 px-6 rounded-xl bg-[#F5F6F7] border border-[#EAECF0]">
                  <button
                    type="button"
                    onClick={() => {
                      const authorKey =
                        author?.slug ||
                        author?.id ||
                        article.authorId ||
                        'muhammad-nurcholish';
                      onNavigate(`/authors/${authorKey}`);
                    }}
                    className="flex items-center gap-3.5 text-left group/author hover:opacity-85 transition-opacity cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-white shadow-xs">
                      <img
                        src={author?.photoUrl || BUNDLED_IMAGES.authorNurcholish}
                        alt={author?.name || 'Penulis ARUNA'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = BUNDLED_IMAGES.authorNurcholish;
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#0B1F33] group-hover/author:text-[#B59A5A] transition-colors block">
                        {author?.name || 'Muhammad Nurcholish'}
                      </span>
                      <span className="text-xs text-[#667085] block">
                        {author?.role || 'Penulis & Praktisi Operasional Bisnis'}
                      </span>
                      {article.publishedAt && (
                        <span className="text-[11px] text-[#667085] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#B59A5A]" />
                          Dipublikasikan: {article.publishedAt}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Share buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      title="Salin tautan artikel"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0B1F33] bg-white border border-[#EAECF0] hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-[#667085]" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleShareWhatsApp}
                      title="Bagikan ke WhatsApp"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B59A5A]" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </header>

              {/* Cover Image */}
              {article.coverImage && (
                <div className="mb-12 rounded-2xl overflow-hidden border border-[#EAECF0] bg-[#0B1F33]/5 aspect-[16/9] relative shadow-sm">
                  {!imgError ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="eager"
                      fetchPriority="high"
                      width={1200}
                      height={675}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const fallback = getBundledFallback(article.slug || article.title);
                        if ((e.currentTarget as HTMLImageElement).src !== fallback) {
                          (e.currentTarget as HTMLImageElement).src = fallback;
                        } else {
                          setImgError(true);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1F33] text-white p-8 text-center">
                      <span className="text-xs font-mono text-[#B59A5A] mb-2 font-bold uppercase tracking-wider">
                        ARUNA Editorial Perspective
                      </span>
                      <span className="text-xl sm:text-2xl font-bold max-w-lg">{article.title}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Article Content Body */}
              <div className="max-w-none text-[#0B1F33] mb-16">
                {renderFormattedContent(article.content)}
              </div>

              {/* Author Attribution Card */}
              {author && (
                <div className="p-7 sm:p-9 rounded-2xl bg-[#F5F6F7] border border-[#EAECF0] mb-14 shadow-xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        const authorKey =
                          author.slug ||
                          author.id ||
                          article.authorId ||
                          'muhammad-nurcholish';
                        onNavigate(`/authors/${authorKey}`);
                      }}
                      className="flex items-start sm:items-center gap-5 text-left group/card hover:opacity-85 transition-opacity cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#0B1F33] shrink-0 border-2 border-white shadow-xs">
                        <img
                          src={author.photoUrl || BUNDLED_IMAGES.authorNurcholish}
                          alt={author.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = BUNDLED_IMAGES.authorNurcholish;
                          }}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-[#B59A5A] font-bold block mb-1">
                          Tentang Penulis
                        </span>
                        <h3 className="text-xl font-bold text-[#0B1F33] group-hover/card:text-[#B59A5A] transition-colors">
                          {author.name}
                        </h3>
                        <span className="text-xs text-[#667085] font-semibold block mt-0.5">
                          {author.role}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const authorKey =
                          author.slug ||
                          author.id ||
                          article.authorId ||
                          'muhammad-nurcholish';
                        onNavigate(`/authors/${authorKey}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-[#EAECF0] text-xs font-bold text-[#0B1F33] hover:bg-[#0B1F33] hover:text-white transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                    >
                      <span>Semua Tulisan Penulis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    {author.bio}
                  </p>
                </div>
              )}

              {/* Natural Advisory Next-Step Banner */}
              <div className="p-8 sm:p-10 rounded-2xl bg-[#0B1F33] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-16 shadow-lg">
                <div className="max-w-lg">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#B59A5A] font-bold block mb-1.5">
                    Langkah Berikutnya
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {lang === 'id'
                      ? 'Menghadapi friksi operasional serupa pada bisnis Anda?'
                      : 'Facing similar operational friction in your business?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                    {lang === 'id'
                      ? 'Mari diskusikan alur kerja riil, titik kebocoran persediaan, dan kesiapan sistem outlet Anda bersama tim advisor ARUNA.'
                      : 'Discuss your real operational workflows, inventory leakage points, and multi-outlet readiness with an ARUNA advisor.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <a
                    href="https://wa.me/6289638402869?text=Halo%20ARUNA,%20saya%20tertarik%20berdiskusi%20setelah%20membaca%20artikel%20Insights."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-center"
                  >
                    WhatsApp Advisor
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsConsultModalOpen(true)}
                    className="px-6 py-3 text-xs font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded-lg transition-all text-center cursor-pointer shadow-xs"
                  >
                    Bicara dengan Advisor →
                  </button>
                </div>
              </div>

              {/* Related Articles Section */}
              {relatedArticles.length > 0 && (
                <div className="pt-10 border-t border-[#EAECF0]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#B59A5A] font-bold block mb-1">
                        Bacaan Terkait
                      </span>
                      <h3 className="text-2xl font-bold text-[#0B1F33]">
                        Artikel Lain dalam Kategori {article.category}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('/insights')}
                      className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] transition-colors"
                    >
                      <span>Lihat Semua Insights</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((rel) => (
                      <article
                        key={rel.id}
                        onClick={() => onNavigate(`/insights/${rel.slug}`)}
                        className="p-6 rounded-xl bg-white border border-[#EAECF0] hover:border-[#0B1F33]/40 cursor-pointer transition-all shadow-xs flex flex-col justify-between group"
                      >
                        <div>
                          {rel.coverImage && (
                            <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#0B1F33]/5 mb-4 relative">
                              <img
                                src={rel.coverImage}
                                alt={rel.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = getBundledFallback(rel.slug || rel.title);
                                }}
                              />
                              <div className="absolute top-2.5 left-2.5">
                                <span className="px-2 py-0.5 rounded bg-[#0B1F33]/85 text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                                  {rel.category}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-[#667085] mb-2 font-medium">
                            <span>{rel.publishedAt}</span>
                            <span>·</span>
                            <span>{rel.readingTime} min</span>
                          </div>

                          <h4 className="text-base font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors leading-snug line-clamp-2 mb-2">
                            {rel.title}
                          </h4>

                          <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 mb-4">
                            {rel.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-[#EAECF0] flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0B1F33] group-hover:text-[#B59A5A] inline-flex items-center gap-1 transition-colors">
                            <span>Baca Artikel</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        )}
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenConsultation={() => setIsConsultModalOpen(true)}
        onOpenCms={onOpenCms}
      />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
