import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Share2, ArrowRight, Check, MessageSquare, User, ArrowLeft } from 'lucide-react';
import { Article, Author, Language } from '../../types';
import { ArticlesService } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenConsultation: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectAuthor: (authorId: string) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  lang,
  onOpenConsultation,
  onSelectArticle,
  onSelectAuthor,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [author, setAuthor] = useState<Author | null>(article?.author || null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!article) return;
    if (article.author) {
      setAuthor(article.author);
    } else {
      AuthorsService.getAuthorById(article.authorId).then((res) => {
        if (res) setAuthor(res);
      });
    }

    ArticlesService.getRelatedArticles(article.id, article.category, 2).then((list) => {
      setRelatedArticles(list);
    });
  }, [article]);

  if (!isOpen || !article) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/#insight-${article.slug}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Artikel menarik dari ARUNA Insights: "${article.title}" oleh ${author?.name || 'ARUNA'}. Baca di sini: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Helper to render rich markdown-like paragraphs, headers, and quotes
  const renderFormattedContent = (raw: string) => {
    const blocks = raw.split('\n\n');

    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Horizontal separator
      if (trimmed === '---') {
        return <hr key={idx} className="my-8 border-t border-[#EAECF0]" />;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold text-[#0B1F33] tracking-tight mt-8 mb-4 font-sans"
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
            className="text-2xl sm:text-3xl font-bold text-[#0B1F33] tracking-tight mt-10 mb-5 font-sans"
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
            className="p-6 my-6 rounded-r-lg bg-[#F5F6F7] border-l-4 border-[#B59A5A] text-base sm:text-lg font-medium text-[#0B1F33] italic leading-relaxed"
          >
            {quoteText}
          </blockquote>
        );
      }

      // Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
        const lines = trimmed.split('\n');
        return (
          <ul key={idx} className="space-y-2 my-4 pl-4">
            {lines.map((line, lIdx) => (
              <li key={lIdx} className="text-sm sm:text-base text-[#667085] leading-relaxed flex items-start gap-2">
                <span className="text-[#B59A5A] font-bold mt-1">·</span>
                <span>{line.replace(/^[-*]\s+|\d+\.\s+/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-[#0B1F33]/90 leading-relaxed mb-5 font-normal"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#0B1F33]/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white min-h-screen sm:min-h-0 sm:rounded-2xl shadow-2xl border border-[#EAECF0] overflow-hidden my-0 sm:my-8 text-[#0B1F33]">
        {/* Sticky Reading Top Bar */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-[#EAECF0] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#667085]">
            <span className="text-[#B59A5A]">ARUNA INSIGHTS</span>
            <span>·</span>
            <span>{article.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className="p-2 text-[#667085] hover:text-[#0B1F33] hover:bg-[#F5F6F7] rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline text-xs">{copied ? 'Tersalin' : 'Bagikan'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#0B1F33] hover:bg-[#F5F6F7] rounded-md transition-colors cursor-pointer"
              aria-label="Tutup Artikel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Editorial Body */}
        <div className="px-6 sm:px-12 md:px-16 pt-8 pb-16 max-w-3xl mx-auto">
          {/* Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#667085] font-medium mb-4">
            <span className="text-[#B59A5A] font-bold uppercase tracking-wider font-mono">
              {article.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} min read
            </span>
          </div>

          {/* Master Article Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-[1.15] mb-6 text-balance font-sans">
            {article.title}
          </h1>

          {/* Editorial Excerpt */}
          <p className="text-lg sm:text-xl text-[#667085] leading-relaxed mb-8 font-medium">
            {article.excerpt}
          </p>

          {/* Author Byline Lockup */}
          {author && (
            <div
              onClick={() => onSelectAuthor(author.id)}
              className="flex items-center gap-4 py-4 px-5 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] mb-10 cursor-pointer hover:border-[#B59A5A] transition-colors group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-white">
                <img
                  src={author.photoUrl}
                  alt={author.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to avatar placeholder
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors block truncate">
                  {author.name}
                </span>
                <span className="text-xs text-[#667085] block truncate">
                  {author.role}
                </span>
              </div>
              <span className="text-xs text-[#B59A5A] font-semibold hidden sm:inline">
                Lihat Profil & Artikel →
              </span>
            </div>
          )}

          {/* Cover Image if present */}
          {article.coverImage && (
            <div className="mb-10 rounded-xl overflow-hidden border border-[#EAECF0] bg-[#0B1F33]/5 aspect-[16/9] relative">
              {!imgError ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1F33] text-white p-6 text-center">
                  <span className="text-xs font-mono text-[#B59A5A] mb-1">ARUNA Editorial</span>
                  <span className="text-lg font-bold">{article.title}</span>
                </div>
              )}
            </div>
          )}

          {/* Formatted Article Content */}
          <div className="prose prose-slate max-w-none text-[#0B1F33] leading-relaxed mb-14">
            {renderFormattedContent(article.content)}
          </div>

          {/* Author Biography Box */}
          {author && (
            <div className="p-6 sm:p-8 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] mb-12 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-white">
                  <img
                    src={author.photoUrl}
                    alt={author.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#667085] block mb-0.5">
                    Tentang Penulis
                  </span>
                  <h4 className="text-lg font-bold text-[#0B1F33]">
                    {author.name}
                  </h4>
                  <span className="text-xs text-[#B59A5A] font-medium block">
                    {author.role}
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                {author.bio}
              </p>
              <button
                type="button"
                onClick={() => onSelectAuthor(author.id)}
                className="text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat semua artikel karya {author.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Natural Advisory Next-Step CTA */}
          <div className="p-8 rounded-xl bg-[#0B1F33] text-white text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 shadow-md">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#B59A5A] block mb-1">
                Langkah Berikutnya
              </span>
              <h4 className="text-xl font-bold text-white mb-1">
                {lang === 'id'
                  ? 'Memiliki masalah bisnis yang layak didiskusikan?'
                  : 'Have a business problem worth discussing?'}
              </h4>
              <p className="text-xs text-white/75 max-w-md">
                {lang === 'id'
                  ? 'Diskusikan letak friksi proses dan kesiapan sistem Anda bersama advisor ARUNA.'
                  : 'Discuss your operational bottlenecks and system readiness with an ARUNA advisor.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="px-6 py-3 text-xs font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] rounded-md transition-colors whitespace-nowrap self-center sm:self-auto shrink-0 cursor-pointer"
            >
              {lang === 'id' ? 'Bicara dengan Advisor' : 'Talk to an Advisor'}
            </button>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-[#EAECF0]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#667085] block mb-4">
                Artikel Terkait dalam Kategori {article.category}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectArticle(rel)}
                    className="p-5 rounded-lg bg-[#F5F6F7] border border-[#EAECF0] hover:border-[#0B1F33]/40 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-[#B59A5A] uppercase font-bold block mb-1">
                        {rel.category}
                      </span>
                      <h5 className="text-sm font-bold text-[#0B1F33] line-clamp-2 mb-2">
                        {rel.title}
                      </h5>
                      <p className="text-xs text-[#667085] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <span className="text-xs text-[#0B1F33] font-semibold mt-3 inline-flex items-center gap-1 group-hover:text-[#B59A5A]">
                      <span>Baca Insight</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
