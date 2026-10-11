import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Article, Author, Language } from '../../types';
import { ArticlesService } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { BUNDLED_IMAGES, getBundledFallback } from '../../assets/bundledImages';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ConsultationModal } from '../ConsultationModal';

interface AuthorArchivePageProps {
  slug: string;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (path: string) => void;
  onOpenCms: () => void;
}

export const AuthorArchivePage: React.FC<AuthorArchivePageProps> = ({
  slug,
  lang,
  onLanguageChange,
  onNavigate,
  onOpenCms,
}) => {
  const [author, setAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadAuthorData = async () => {
      try {
        const fetchedAuthor = await AuthorsService.getAuthorBySlug(slug);

        if (!isMounted) return;

        if (!fetchedAuthor) {
          setAuthor(null);
          setIsLoading(false);
          document.title = 'Penulis Tidak Ditemukan | ARUNA Insights';
          return;
        }

        // Clean any accidental "founder" terms from role or bio
        const sanitizedAuthor: Author = {
          ...fetchedAuthor,
          role: fetchedAuthor.role
            ? fetchedAuthor.role.replace(/founder/gi, 'Penulis')
            : 'Penulis & Kontributor',
          bio: (fetchedAuthor.bio || '')
            .replace(/Founder ARUNA\.\s*/gi, '')
            .replace(/\bFounder,\s*ARUNA\b/gi, ''),
        };

        setAuthor(sanitizedAuthor);

        // Fetch published articles genuinely written by this author
        const authorArticles = await ArticlesService.getAuthorArticles(sanitizedAuthor.slug || sanitizedAuthor.id);
        
        if (isMounted) {
          // Strictly ensure only published articles are shown
          setArticles(authorArticles.filter((a) => a.status === 'published'));
          setIsLoading(false);

          // Update Document Title and SEO
          const pageTitle = `${sanitizedAuthor.name} — Penulis & Kontributor | ARUNA Insights`;
          document.title = pageTitle;

          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute(
            'content',
            `Kumpulan artikel dan publikasi analisis bisnis oleh ${sanitizedAuthor.name} di ARUNA Insights.`
          );

          // Canonical link
          let canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
          }
          canonical.setAttribute('href', `${window.location.origin}/authors/${slug}`);
        }
      } catch (err) {
        console.error('Error loading author archive:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAuthorData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

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
          <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-12 h-12 border-3 border-[#0B1F33]/20 border-t-[#0B1F33] rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#667085]">Memuat profil penulis & artikel...</p>
          </div>
        )}

        {/* Not Found State */}
        {!isLoading && !author && (
          <div className="max-w-2xl mx-auto px-6 py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 text-amber-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] mb-3">
              Profil Penulis Tidak Ditemukan
            </h1>
            <p className="text-sm text-[#667085] leading-relaxed mb-8">
              Penulis dengan tautan <code className="px-2 py-0.5 bg-[#F5F6F7] rounded text-[#0B1F33] font-mono">/authors/{slug}</code> tidak ditemukan dalam publikasi ARUNA.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/insights')}
                className="px-6 py-3 rounded-lg bg-[#0B1F33] text-white text-xs font-semibold hover:bg-[#132D47] transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Jelajahi Semua Insights</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="px-6 py-3 rounded-lg bg-white border border-[#EAECF0] text-[#0B1F33] text-xs font-semibold hover:bg-[#F5F6F7] transition-all cursor-pointer"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {/* Author Details and Articles */}
        {!isLoading && author && (
          <div className="py-12 sm:py-16">
            <div className="max-w-6xl mx-auto px-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-[#667085] mb-8 pb-4 border-b border-[#EAECF0]">
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
                <span className="text-[#0B1F33] font-semibold">Penulis: {author.name}</span>
              </div>

              {/* Author Profile Header Card */}
              <div className="p-8 sm:p-10 rounded-2xl bg-[#F5F6F7] border border-[#EAECF0] mb-14 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#0B1F33] shrink-0 border-2 border-white shadow-md">
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
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#0B1F33] text-white text-[10px] font-mono font-bold tracking-wider uppercase">
                          Penulis
                        </span>
                        <span className="text-xs text-[#667085] flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Terverifikasi ARUNA
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] mb-1.5">
                        {author.name}
                      </h1>
                      <p className="text-xs sm:text-sm font-semibold text-[#B59A5A]">
                        {author.role}
                      </p>
                    </div>
                  </div>

                  {/* Stat badge */}
                  <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-xl border border-[#EAECF0] self-stretch sm:self-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-[#0B1F33]" />
                      <div>
                        <span className="text-xs text-[#667085] block font-medium">Total Publikasi</span>
                        <span className="text-lg font-bold text-[#0B1F33]">
                          {articles.length} Artikel
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author Bio */}
                {author.bio && (
                  <div className="mt-6 pt-6 border-t border-[#EAECF0]/80">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#667085] font-bold mb-2">
                      Biografi & Fokus Praktik
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475467] leading-relaxed max-w-4xl">
                      {author.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Section Heading: Articles by Author */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F33]">
                    Artikel oleh {author.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#667085] mt-1">
                    Daftar seluruh artikel dan telaah operasional yang ditulis secara sah oleh {author.name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('/insights')}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Jelajahi Topik Lain</span>
                </button>
              </div>

              {/* Articles Grid or Empty State */}
              {articles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#F5F6F7] border border-[#EAECF0]">
                  <BookOpen className="w-8 h-8 text-[#667085] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-[#0B1F33] mb-1">
                    Belum Ada Artikel yang Dipublikasikan
                  </h3>
                  <p className="text-xs text-[#667085] max-w-md mx-auto mb-6">
                    Penulis ini belum memiliki artikel berstatus published di ARUNA Insights.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('/insights')}
                    className="px-5 py-2.5 rounded-lg bg-[#0B1F33] text-white text-xs font-semibold hover:bg-[#132D47] transition-all cursor-pointer"
                  >
                    Kembali ke Insights
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((art) => (
                    <article
                      key={art.id}
                      onClick={() => onNavigate(`/insights/${art.slug}`)}
                      className="group flex flex-col bg-white rounded-2xl border border-[#EAECF0] hover:border-[#0B1F33]/30 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
                    >
                      {/* Card Cover Image */}
                      <div className="aspect-[16/10] overflow-hidden bg-[#0B1F33]/5 relative border-b border-[#EAECF0]">
                        <img
                          src={art.coverImage || getBundledFallback(art.slug)}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getBundledFallback(art.slug);
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#0B1F33]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                            {art.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Date & Reading time */}
                          <div className="flex items-center gap-3 text-xs text-[#667085] mb-3">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-[#B59A5A]" />
                              {art.publishedAt}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {art.readingTime} min
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors leading-snug mb-3 line-clamp-2">
                            {art.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-xs sm:text-sm text-[#667085] line-clamp-3 leading-relaxed mb-6 font-normal">
                            {art.excerpt}
                          </p>
                        </div>

                        {/* Card Footer CTA */}
                        <div className="pt-4 border-t border-[#EAECF0] flex items-center justify-between mt-auto">
                          <span className="text-xs font-semibold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors inline-flex items-center gap-1.5">
                            Baca Artikel
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </span>
                          <span className="text-[11px] text-[#667085] font-mono">
                            ARUNA
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer with Official Contacts */}
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
