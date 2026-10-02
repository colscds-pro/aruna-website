import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Tag,
  ImageIcon,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit,
  Eye
} from 'lucide-react';
import { Article, Author, Category } from '../../types';
import { ArticlesService } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { CategoriesService } from '../../services/supabase/categoriesService';
import { MediaService } from '../../services/supabase/mediaService';

interface AdminDashboardProps {
  onNavigate: (tab: 'articles' | 'authors' | 'categories' | 'media' | 'settings') => void;
  onNewArticle: () => void;
  onEditArticle: (articleId: string) => void;
  onPreviewArticle: (article: Article) => void;
  onViewWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onNewArticle,
  onEditArticle,
  onPreviewArticle,
  onViewWebsite,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const [arts, auths, cats, meds] = await Promise.all([
          ArticlesService.getAllArticles(),
          AuthorsService.getAuthors(false),
          CategoriesService.getCategories(false),
          MediaService.getAllMedia(),
        ]);
        setArticles(arts);
        setAuthorsCount(auths.length);
        setCategoriesCount(cats.length);
        setMediaCount(meds.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.status === 'published').length;
  const draftArticles = articles.filter((a) => a.status === 'draft').length;
  const featuredArticles = articles.filter((a) => a.featured).length;

  const recentArticles = articles.slice(0, 5);

  const statsCards = [
    { label: 'Total Artikel', value: totalArticles, icon: <FileText className="w-5 h-5 text-[#0B1F33]" />, tab: 'articles' as const },
    { label: 'Dipublikasikan', value: publishedArticles, icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, tab: 'articles' as const },
    { label: 'Draft', value: draftArticles, icon: <Clock className="w-5 h-5 text-amber-600" />, tab: 'articles' as const },
    { label: 'Featured', value: featuredArticles, icon: <Sparkles className="w-5 h-5 text-[#B59A5A]" />, tab: 'articles' as const },
    { label: 'Penulis', value: authorsCount, icon: <Users className="w-5 h-5 text-[#0B1F33]" />, tab: 'authors' as const },
    { label: 'Kategori', value: categoriesCount, icon: <Tag className="w-5 h-5 text-[#0B1F33]" />, tab: 'categories' as const },
    { label: 'Media', value: mediaCount, icon: <ImageIcon className="w-5 h-5 text-[#0B1F33]" />, tab: 'media' as const },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#0B1F33] text-white">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B59A5A] block mb-1">
            Editorial Workspace
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang di CMS ARUNA
          </h2>
          <p className="text-xs sm:text-sm text-white/75 mt-1 max-w-xl">
            Kelola publikasi artikel Insights, media website, penulis, dan kategori secara mandiri tanpa perlu menyentuh source code.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onNewArticle}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#0B1F33] text-xs font-semibold rounded-md hover:bg-[#F5F6F7] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#B59A5A]" />
            <span>Tulis Artikel Baru</span>
          </button>
          <button
            type="button"
            onClick={onViewWebsite}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-md border border-white/20 transition-colors cursor-pointer"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#B59A5A]" />
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {statsCards.map((st) => (
          <div
            key={st.label}
            onClick={() => onNavigate(st.tab)}
            className="p-4 bg-white rounded-xl border border-[#EAECF0] shadow-2xs hover:border-[#0B1F33]/40 transition-colors cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#667085] truncate">{st.label}</span>
              {st.icon}
            </div>
            <span className="text-2xl font-bold text-[#0B1F33] font-mono">
              {isLoading ? '—' : st.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Articles Section */}
      <div className="bg-white rounded-xl border border-[#EAECF0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAECF0]">
          <div>
            <h3 className="text-sm font-bold text-[#0B1F33] uppercase font-mono tracking-wider">
              Artikel Terbaru
            </h3>
            <p className="text-xs text-[#667085]">Artikel yang baru dibuat atau diperbarui di sistem.</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('articles')}
            className="text-xs font-semibold text-[#0B1F33] hover:text-[#B59A5A] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua ({totalArticles})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentArticles.length === 0 ? (
          <p className="text-xs text-[#667085] py-4">Belum ada artikel.</p>
        ) : (
          <div className="divide-y divide-[#EAECF0]">
            {recentArticles.map((art) => (
              <div
                key={art.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-[#F5F6F7]/50 transition-colors px-2 rounded-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {art.coverImage && (
                    <img
                      src={art.coverImage}
                      alt=""
                      className="w-10 h-10 rounded object-cover shrink-0 border border-[#EAECF0]"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#0B1F33] block truncate">
                      {art.title}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#667085] font-mono mt-0.5">
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        art.status === 'published' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {art.status}
                      </span>
                      <span>·</span>
                      <span>{art.category}</span>
                      <span>·</span>
                      <span>{art.publishedAt || art.createdAt?.split('T')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onPreviewArticle(art)}
                    className="p-1.5 text-[#667085] hover:text-[#0B1F33]"
                    title="Pratinjau"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditArticle(art.id)}
                    className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A]"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
