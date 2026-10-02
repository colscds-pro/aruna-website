import React, { useState, useEffect } from 'react';
import { Search, Clock, Calendar, ArrowRight, User, Sparkles, Filter, BookOpen } from 'lucide-react';
import { Article, ArticleCategory, Language } from '../../types';
import { InsightsService, subscribeToInsights } from '../../services/insightsStorage';

interface InsightsSectionProps {
  lang: Language;
  onSelectArticle: (article: Article) => void;
  onSelectAuthor: (authorId: string) => void;
  onOpenConsultation: () => void;
  onOpenCms: () => void;
}

const CATEGORIES: ('ALL' | ArticleCategory)[] = [
  'ALL',
  'OPINION',
  'BUSINESS',
  'ERP & TECHNOLOGY',
  'INDUSTRY',
  'FIELD NOTES',
];

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  lang,
  onSelectArticle,
  onSelectAuthor,
  onOpenConsultation,
  onOpenCms,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ArticleCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshArticles = () => {
    // Only published articles are visible to the public!
    setArticles(InsightsService.getPublishedArticles());
  };

  useEffect(() => {
    refreshArticles();
    return subscribeToInsights(refreshArticles);
  }, []);

  // Filtered published articles
  const filtered = articles.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const featured = articles.find((a) => a.featured) || articles[0];
  const listArticles = filtered.filter((a) => a.id !== featured?.id || selectedCategory !== 'ALL' || searchQuery.trim().length > 0);
  const primaryAuthor = InsightsService.getAuthorById('muhammad-nurcholish') || InsightsService.getAuthors()[0];

  return (
    <section id="insights" className="py-20 md:py-28 bg-white border-t border-[#EAECF0]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#B59A5A] mb-3">
              <span>INSIGHTS</span>
              <span aria-hidden="true">·</span>
              <span>Perspektif & Observasi Lapangan</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0B1F33] leading-tight mb-4 text-balance">
              {lang === 'id'
                ? 'Pemikiran di Balik Make Business Make Sense'
                : 'Thinking Behind Make Business Make Sense'}
            </h2>

            <p className="text-base sm:text-lg text-[#667085] leading-relaxed">
              {lang === 'id'
                ? 'Bukan blog korporat biasa. Ini adalah catatan lapangan, diagnosa masalah operasional, dan sudut pandang praktis dari pengalaman implementasi transformasi bisnis nyata.'
                : 'Not a generic corporate blog. These are field notes, operational diagnoses, and practical perspectives forged from real-world business transformation implementations.'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative self-start md:self-auto shrink-0 w-full sm:w-72">
            <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik insight..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-[#EAECF0] rounded-lg bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] placeholder:text-[#667085]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B1F33] text-white shadow-xs'
                    : 'bg-[#F5F6F7] text-[#667085] border border-[#EAECF0] hover:text-[#0B1F33] hover:bg-white'
                }`}
              >
                {cat === 'ALL' ? 'Semua Topik' : cat}
              </button>
            );
          })}
        </div>

        {/* Featured Editorial Carrier (shown when no specific search/filter query) */}
        {selectedCategory === 'ALL' && !searchQuery.trim() && featured && (
          <div
            onClick={() => onSelectArticle(featured)}
            className="mb-14 rounded-2xl bg-white border border-[#EAECF0] shadow-sm overflow-hidden hover:border-[#0B1F33]/40 cursor-pointer transition-all group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-auto min-h-[320px] bg-[#0B1F33]/5 overflow-hidden">
                {featured.coverImage ? (
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0B1F33] flex items-center justify-center p-8 text-white">
                    <span className="text-xl font-bold">ARUNA Featured Insight</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded bg-[#0B1F33]/85 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                    FEATURED INSIGHT
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#667085] font-medium mb-3">
                    <span className="text-[#B59A5A] font-bold font-mono uppercase tracking-wider">
                      {featured.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readingTime} min read
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] mb-3 leading-snug group-hover:text-[#B59A5A] transition-colors">
                    {featured.title}
                  </h3>

                  <p className="text-sm text-[#667085] leading-relaxed mb-6 font-normal">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EAECF0] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {featured.author?.photoUrl && (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-[#EAECF0]">
                        <img
                          src={featured.author.photoUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#0B1F33]">
                      {featured.author?.name || 'Muhammad Nurcholish'}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#0B1F33] group-hover:text-[#B59A5A] inline-flex items-center gap-1 transition-colors">
                    <span>Baca Artikel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {listArticles.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-xl border border-[#EAECF0]">
              <p className="text-sm text-[#667085]">
                Belum ada artikel yang cocok dengan filter atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            listArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-white rounded-xl border border-[#EAECF0] shadow-xs hover:border-[#0B1F33]/40 cursor-pointer transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {art.coverImage && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#0B1F33]/5 relative">
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-0.5 rounded bg-[#0B1F33]/85 text-white text-[10px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                          {art.category}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-[#667085] font-medium mb-2.5">
                      <span>{art.publishedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {art.readingTime} min
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-[#0B1F33] mb-2 leading-snug group-hover:text-[#B59A5A] transition-colors line-clamp-2">
                      {art.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#667085] leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-2 border-t border-[#EAECF0] flex items-center justify-between">
                  <span className="text-xs text-[#667085]">
                    {art.author?.name || 'Muhammad Nurcholish'}
                  </span>
                  <span className="text-xs font-semibold text-[#0B1F33] group-hover:text-[#B59A5A] inline-flex items-center gap-1 transition-colors">
                    <span>Baca</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Primary Author Spotlight Card */}
        {primaryAuthor && (
          <div className="p-8 sm:p-10 rounded-2xl bg-[#F5F6F7] border border-[#EAECF0] shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-3 flex justify-center md:justify-start">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[#0B1F33] border-2 border-white shadow-xs">
                  <img
                    src={primaryAuthor.photoUrl}
                    alt={primaryAuthor.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="md:col-span-6 text-center md:text-left">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
                  Penulis Utama & Pendiri
                </span>
                <h3 className="text-2xl font-bold text-[#0B1F33] mb-1">
                  {primaryAuthor.name}
                </h3>
                <span className="text-xs font-semibold text-[#667085] block mb-3">
                  {primaryAuthor.role}
                </span>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-xl">
                  {primaryAuthor.bio}
                </p>
              </div>

              <div className="md:col-span-3 flex flex-col items-center md:items-end justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectAuthor(primaryAuthor.id)}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#0B1F33] bg-white border border-[#EAECF0] hover:bg-[#EAECF0] rounded-md transition-colors text-center cursor-pointer"
                >
                  Lihat Semua Artikel Penulis
                </button>
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors text-center cursor-pointer"
                >
                  Konsultasi dengan Founder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Natural Next-Step CTA */}
        <div className="p-8 rounded-xl bg-[#F5F6F7] border border-[#EAECF0] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-[#0B1F33]">
              {lang === 'id'
                ? 'Suka dengan cara kami melihat masalah bisnis?'
                : 'Appreciate how we diagnose business problems?'}
            </h4>
            <p className="text-xs text-[#667085] mt-0.5">
              {lang === 'id'
                ? 'Mari diskusikan alur operasional dan kesiapan sistem outlet Anda bersama tim advisor ARUNA.'
                : 'Let’s discuss your operational workflows and outlet system readiness with our advisory team.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenConsultation}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
          >
            {lang === 'id' ? 'Bicara dengan Advisor →' : 'Talk to an Advisor →'}
          </button>
        </div>
      </div>
    </section>
  );
};
