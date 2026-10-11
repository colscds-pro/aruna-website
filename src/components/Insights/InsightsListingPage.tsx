import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  BookOpen,
  Sparkles,
  Search,
} from 'lucide-react';
import { Article, Category, Language } from '../../types';
import { ArticlesService } from '../../services/supabase/articlesService';
import { CategoriesService } from '../../services/supabase/categoriesService';
import { BUNDLED_IMAGES, getBundledFallback } from '../../assets/bundledImages';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { ConsultationModal } from '../ConsultationModal';
import { updatePageSeo } from '../../utils/seo';

interface InsightsListingPageProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (path: string) => void;
  onOpenCms: () => void;
}

export const InsightsListingPage: React.FC<InsightsListingPageProps> = ({
  lang,
  onLanguageChange,
  onNavigate,
  onOpenCms,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        const [fetchedArticles, fetchedCategories] = await Promise.all([
          ArticlesService.getPublishedArticles(),
          CategoriesService.getCategories(true),
        ]);

        if (!isMounted) return;

        // Ensure strictly published articles
        const publishedOnly = fetchedArticles.filter((a) => a.status === 'published');
        setArticles(publishedOnly);
        setCategories(fetchedCategories);
        setIsLoading(false);

        // Document Title & SEO
        updatePageSeo({
          title: 'Insights & Telaah Operasional Bisnis | ARUNA',
          description: 'Kajian mendalam mengenai arsitektur proses, kontrol margin, mitigasi kebocoran persediaan, dan kesiapan sistem sebelum ekspansi cabang ritel dan F&B.',
          url: '/insights',
          image: '/og-aruna-default.jpg',
          type: 'website',
        });
      } catch (err) {
        console.error('Error loading insights listing data:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter articles based on category and search query
  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      art.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured article (first featured article or first article in list)
  const featuredArticle =
    selectedCategory === 'ALL' && searchQuery.trim() === ''
      ? articles.find((a) => a.featured) || articles[0]
      : null;

  // Remaining articles for grid listing
  const gridArticles = featuredArticle
    ? filteredArticles.filter((a) => a.id !== featuredArticle.id)
    : filteredArticles;

  const paginatedArticles = gridArticles.slice(0, visibleCount);
  const hasMore = gridArticles.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
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
        {/* Header Hero Area */}
        <section className="bg-gradient-to-b from-[#F5F6F7] to-white border-b border-[#EAECF0] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-[#667085] mb-6">
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="hover:text-[#0B1F33] transition-colors cursor-pointer"
              >
                Beranda
              </button>
              <span>/</span>
              <span className="text-[#0B1F33] font-semibold">Insights</span>
            </div>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F33] text-white text-xs font-mono font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#B59A5A]" />
                <span>ARUNA EDITORIAL PERSPECTIVE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1F33] tracking-tight leading-tight mb-4">
                Insights & Telaah Operasional Bisnis
              </h1>
              <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
                Kajian mendalam mengenai arsitektur proses, kontrol margin, mitigasi kebocoran persediaan, dan kesiapan sistem sebelum ekspansi cabang ritel dan F&B.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="mt-10 pt-8 border-t border-[#EAECF0] flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === 'ALL'
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-white text-[#667085] hover:text-[#0B1F33] border border-[#EAECF0]'
                  }`}
                >
                  Semua Topik ({articles.length})
                </button>
                {categories.map((cat) => {
                  const count = articles.filter(
                    (a) => a.category.toUpperCase() === cat.name.toUpperCase()
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setVisibleCount(6);
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory.toUpperCase() === cat.name.toUpperCase()
                          ? 'bg-[#0B1F33] text-white shadow-xs'
                          : 'bg-white text-[#667085] hover:text-[#0B1F33] border border-[#EAECF0]'
                      }`}
                    >
                      {cat.name} {count > 0 && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(6);
                  }}
                  placeholder="Cari judul atau topik..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#EAECF0] rounded-lg text-[#0B1F33] placeholder-[#667085] focus:outline-hidden focus:border-[#0B1F33]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Loading state */}
            {isLoading && (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-3 border-[#0B1F33]/20 border-t-[#0B1F33] rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-[#667085]">Memuat seluruh publikasi Insights...</p>
              </div>
            )}

            {!isLoading && (
              <>
                {/* Featured Article Section (When on All topics & no search) */}
                {featuredArticle && (
                  <div className="mb-16">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B59A5A]" />
                      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F33]">
                        Artikel Unggulan Terpilih
                      </h2>
                    </div>

                    <div
                      onClick={() => onNavigate(`/insights/${featuredArticle.slug}`)}
                      className="group bg-[#F5F6F7] rounded-3xl border border-[#EAECF0] hover:border-[#0B1F33]/30 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden grid grid-cols-1 lg:grid-cols-12"
                    >
                      <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#0B1F33]/5 relative min-h-[300px]">
                        <img
                          src={featuredArticle.coverImage || getBundledFallback(featuredArticle.slug)}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getBundledFallback(featuredArticle.slug);
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-md bg-[#0B1F33] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
                            {featuredArticle.category}
                          </span>
                        </div>
                      </div>

                      <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 text-xs text-[#667085] mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#B59A5A]" />
                              {featuredArticle.publishedAt}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {featuredArticle.readingTime} min read
                            </span>
                          </div>

                          <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors leading-tight mb-4">
                            {featuredArticle.title}
                          </h3>

                          <p className="text-sm text-[#667085] leading-relaxed mb-8">
                            {featuredArticle.excerpt}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-[#EAECF0] flex items-center justify-between">
                          {/* Author clickable link */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const authorKey =
                                featuredArticle.author?.slug ||
                                featuredArticle.author?.id ||
                                featuredArticle.authorId ||
                                'muhammad-nurcholish';
                              onNavigate(`/authors/${authorKey}`);
                            }}
                            className="flex items-center gap-3 text-left group/author hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-white shadow-xs">
                              <img
                                src={
                                  featuredArticle.author?.photoUrl ||
                                  BUNDLED_IMAGES.authorNurcholish
                                }
                                alt={featuredArticle.author?.name || 'Penulis'}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[#0B1F33] block group-hover/author:text-[#B59A5A] transition-colors">
                                {featuredArticle.author?.name || 'Muhammad Nurcholish'}
                              </span>
                              <span className="text-[11px] text-[#667085] block">
                                {featuredArticle.author?.role || 'Penulis & Kontributor'}
                              </span>
                            </div>
                          </button>

                          <span className="px-5 py-2.5 rounded-lg bg-[#0B1F33] text-white text-xs font-bold group-hover:bg-[#132D47] transition-colors inline-flex items-center gap-2 shadow-xs">
                            Baca Artikel
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0B1F33]">
                      {selectedCategory === 'ALL'
                        ? 'Semua Publikasi'
                        : `Topik: ${selectedCategory}`}
                    </h2>
                    <p className="text-xs text-[#667085] mt-1">
                      Menampilkan {filteredArticles.length} artikel terbitan ARUNA Insights.
                    </p>
                  </div>
                </div>

                {/* Empty State */}
                {filteredArticles.length === 0 && (
                  <div className="p-16 text-center rounded-2xl bg-[#F5F6F7] border border-[#EAECF0] max-w-xl mx-auto">
                    <BookOpen className="w-10 h-10 text-[#667085] mx-auto mb-3" />
                    <h3 className="text-base font-bold text-[#0B1F33] mb-1">
                      Tidak Ada Artikel yang Cocok
                    </h3>
                    <p className="text-xs text-[#667085] mb-6">
                      Tidak ditemukan publikasi untuk kategori atau kata kunci pencarian tersebut.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-lg bg-[#0B1F33] text-white text-xs font-semibold hover:bg-[#132D47] transition-all cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}

                {/* Articles Grid */}
                {filteredArticles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedArticles.map((art) => (
                      <article
                        key={art.id}
                        onClick={() => onNavigate(`/insights/${art.slug}`)}
                        className="group flex flex-col bg-white rounded-2xl border border-[#EAECF0] hover:border-[#0B1F33]/30 transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
                      >
                        {/* Image Ratio: consistent aspect-[16/10] */}
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

                        {/* Card Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Metadata */}
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

                          {/* Footer with Author Link & CTA */}
                          <div className="pt-4 border-t border-[#EAECF0] flex items-center justify-between mt-auto">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const authorKey =
                                  art.author?.slug ||
                                  art.author?.id ||
                                  art.authorId ||
                                  'muhammad-nurcholish';
                                onNavigate(`/authors/${authorKey}`);
                              }}
                              className="text-[11px] font-medium text-[#667085] hover:text-[#0B1F33] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                            >
                              <span className="font-semibold text-[#0B1F33]">
                                {art.author?.name || 'Muhammad Nurcholish'}
                              </span>
                            </button>

                            <span className="text-xs font-semibold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors inline-flex items-center gap-1">
                              Baca Artikel
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-14 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="px-8 py-3.5 rounded-xl bg-white border border-[#0B1F33] text-[#0B1F33] text-xs font-bold hover:bg-[#0B1F33] hover:text-white transition-all cursor-pointer shadow-xs"
                    >
                      Muat Lebih Banyak Artikel ({gridArticles.length - visibleCount} tersisa)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
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
