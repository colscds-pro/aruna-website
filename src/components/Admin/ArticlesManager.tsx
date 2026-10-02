import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { Article, Author, Category } from '../../types';
import { ArticlesService, subscribeToArticles } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { CategoriesService } from '../../services/supabase/categoriesService';

interface ArticlesManagerProps {
  onNewArticle: () => void;
  onEditArticle: (articleId: string) => void;
  onPreviewArticle: (article: Article) => void;
}

export const ArticlesManager: React.FC<ArticlesManagerProps> = ({
  onNewArticle,
  onEditArticle,
  onPreviewArticle,
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'updated'>('newest');

  // Deletion confirm modal
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [artList, authList, catList] = await Promise.all([
        ArticlesService.getAllArticles(),
        AuthorsService.getAuthors(false),
        CategoriesService.getCategories(false),
      ]);
      setArticles(artList);
      setAuthors(authList);
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching articles list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToArticles(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Filter & Sort calculation
  const filteredArticles = articles
    .filter((art) => {
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || art.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
      const matchesAuthor = authorFilter === 'all' || art.authorId === authorFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      }
      if (sortBy === 'updated') {
        return new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime();
      }
      return 0;
    });

  const handleTogglePublish = async (art: Article) => {
    try {
      if (art.status === 'published') {
        await ArticlesService.unpublishArticle(art.id);
      } else {
        await ArticlesService.publishArticle(art.id);
      }
      await loadData();
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      await ArticlesService.deleteArticle(articleToDelete.id);
      setArticleToDelete(null);
      await loadData();
    } catch (err) {
      console.error('Failed to delete article:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (art: Article) => {
    try {
      await ArticlesService.toggleFeatured(art.id, !art.featured);
      await loadData();
    } catch (err) {
      console.error('Failed to toggle featured:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
            Manajemen Artikel Insights
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Tulis, sunting, pratinjau, dan kelola publikasi artikel pemikiran ARUNA.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewArticle}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132D47] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4 text-[#B59A5A]" />
          <span>Tulis Artikel Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#EAECF0] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#667085]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan judul atau ringkasan..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
            >
              <option value="all">Semua Status</option>
              <option value="published">Dipublikasikan</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div className="lg:col-span-2">
            <select
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
            >
              <option value="all">Semua Penulis</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
            >
              <option value="newest">Terbaru Dibuat</option>
              <option value="updated">Baru Diperbarui</option>
              <option value="oldest">Paling Awal</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#667085] pt-1">
          <span>Menampilkan <strong>{filteredArticles.length}</strong> artikel</span>
          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || authorFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setAuthorFilter('all');
              }}
              className="text-[11px] text-[#B59A5A] hover:underline font-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-[#EAECF0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            Memuat daftar artikel dari Supabase...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#667085] mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-[#0B1F33]">Tidak ada artikel yang cocok</h4>
            <p className="text-xs text-[#667085]">
              Coba sesuaikan kata kunci pencarian atau bersihkan filter di atas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F5F6F7] border-b border-[#EAECF0] font-mono text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                  <th className="py-3 px-4">Judul & Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4">Publikasi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {filteredArticles.map((art) => {
                  const author = authors.find((a) => a.id === art.authorId || a.slug === art.authorId);
                  return (
                    <tr key={art.id} className="hover:bg-[#F5F6F7]/60 transition-colors">
                      {/* Title & Slug */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-start gap-3">
                          {art.coverImage && (
                            <img
                              src={art.coverImage}
                              alt=""
                              className="w-10 h-10 rounded object-cover shrink-0 border border-[#EAECF0]"
                            />
                          )}
                          <div>
                            <span className="font-bold text-[#0B1F33] block text-sm leading-snug line-clamp-1">
                              {art.title}
                            </span>
                            <span className="font-mono text-[11px] text-[#667085] block truncate mt-0.5">
                              /{art.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(art)}
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title="Klik untuk beralih antara Draft dan Publish"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                          <span>{art.status === 'published' ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] font-bold text-[#B59A5A] bg-[#F5F6F7] border border-[#EAECF0] px-2 py-0.5 rounded">
                          {art.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[#0B1F33] font-medium">
                        {author ? author.name : 'ARUNA Team'}
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(art)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            art.featured ? 'text-[#B59A5A] hover:bg-[#F5F6F7]' : 'text-[#EAECF0] hover:text-[#667085]'
                          }`}
                          title={art.featured ? 'Featured artikel (Klik untuk lepas)' : 'Klik untuk jadikan Featured'}
                        >
                          <Sparkles className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Published Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#667085] font-mono">
                        {art.status === 'published' ? art.publishedAt || 'Hari ini' : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onPreviewArticle(art)}
                            className="p-1.5 text-[#667085] hover:text-[#0B1F33] hover:bg-[#F5F6F7] rounded transition-colors"
                            title="Pratinjau Artikel"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditArticle(art.id)}
                            className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A] hover:bg-[#F5F6F7] rounded transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(art)}
                            className="p-1.5 text-[#667085] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-[#EAECF0]">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#0B1F33]">Konfirmasi Hapus Artikel</h3>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus artikel <strong>"{articleToDelete.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md border border-[#EAECF0] hover:bg-[#F5F6F7]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
