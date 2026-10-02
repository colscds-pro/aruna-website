import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  FileText,
  Lock,
  Unlock,
  RotateCcw,
  Search,
  ExternalLink,
  ChevronRight,
  Save,
  Send,
} from 'lucide-react';
import { Article, ArticleCategory, Author } from '../../types';
import { InsightsService, subscribeToInsights } from '../../services/insightsStorage';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewArticle: (article: Article) => void;
}

const CATEGORIES: ArticleCategory[] = [
  'OPINION',
  'BUSINESS',
  'ERP & TECHNOLOGY',
  'INDUSTRY',
  'FIELD NOTES',
];

const DEFAULT_COVER_PRESETS = [
  { label: 'Minimalist Teak Desk (ERP)', url: '/src/assets/images/insight_erp_foundation_1790919206386.jpg' },
  { label: 'Boutique Store Glass (Branch)', url: '/src/assets/images/insight_second_branch_1790919218110.jpg' },
  { label: 'Consulting Meeting (Strategy)', url: '/src/assets/images/hero_consulting_meeting_1790916424867.jpg' },
  { label: 'Retail Store Interior (Retail)', url: '/src/assets/images/industry_retail_store_1790916438753.jpg' },
  { label: 'F&B Operations (Kitchen/Cafe)', url: '/src/assets/images/industry_fb_operations_1790916451581.jpg' },
  { label: 'Hospitality Lounge (Hotel)', url: '/src/assets/images/industry_hospitality_1790916463500.jpg' },
];

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  isOpen,
  onClose,
  onPreviewArticle,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Articles list state
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Editor mode state: 'list' | 'edit' | 'new'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Editor form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    category: 'BUSINESS' as ArticleCategory,
    authorId: '',
    content: '',
    coverImage: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
    publishedAt: '',
    seoTitle: '',
    seoDescription: '',
    readingTime: 5,
  });

  const [editorPreview, setEditorPreview] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Refresh articles from service
  const refreshData = () => {
    setArticles(InsightsService.getAllArticlesForAdmin());
    setAuthors(InsightsService.getAuthors());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
      return subscribeToInsights(refreshData);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'aruna2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Passcode tidak valid. Gunakan passcode resmi ARUNA (aruna2026).');
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Open editor for new article
  const handleOpenNew = () => {
    const today = new Date().toISOString().substring(0, 10);
    const defaultAuthor = authors[0]?.id || 'muhammad-nurcholish';

    setEditingArticleId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      category: 'BUSINESS',
      authorId: defaultAuthor,
      content: '',
      coverImage: DEFAULT_COVER_PRESETS[0].url,
      status: 'draft',
      featured: false,
      publishedAt: today,
      seoTitle: '',
      seoDescription: '',
      readingTime: 5,
    });
    setEditorPreview(false);
    setViewMode('editor');
  };

  // Open editor for existing article
  const handleOpenEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: article.category,
      authorId: article.authorId,
      content: article.content,
      coverImage: article.coverImage || DEFAULT_COVER_PRESETS[0].url,
      status: article.status,
      featured: article.featured,
      publishedAt: article.publishedAt,
      seoTitle: article.seoTitle || '',
      seoDescription: article.seoDescription || '',
      readingTime: article.readingTime || 5,
    });
    setEditorPreview(false);
    setViewMode('editor');
  };

  // Handle Save
  const handleSave = (targetStatus?: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      alert('Judul artikel wajib diisi.');
      return;
    }

    const calculatedWords = formData.content.split(/\s+/).filter(Boolean).length;
    const estReadingTime = Math.max(1, Math.round(calculatedWords / 200));

    const generatedSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    const statusToSave = targetStatus || formData.status;

    InsightsService.saveArticle({
      id: editingArticleId || undefined,
      title: formData.title.trim(),
      slug: generatedSlug,
      excerpt: formData.excerpt.trim(),
      category: formData.category,
      authorId: formData.authorId,
      content: formData.content,
      coverImage: formData.coverImage,
      status: statusToSave,
      featured: formData.featured,
      publishedAt:
        statusToSave === 'published' && !formData.publishedAt
          ? new Date().toISOString().substring(0, 10)
          : formData.publishedAt,
      seoTitle: formData.seoTitle.trim() || `${formData.title} | ARUNA Insights`,
      seoDescription: formData.seoDescription.trim() || formData.excerpt,
      readingTime: estReadingTime,
    });

    showToast(
      statusToSave === 'published'
        ? 'Artikel berhasil diterbitkan!'
        : 'Draft artikel berhasil disimpan!'
    );
    setViewMode('list');
  };

  // Quick Toggle Publish
  const handleTogglePublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = InsightsService.toggleArticleStatus(id);
    if (updated) {
      showToast(
        updated.status === 'published'
          ? 'Artikel diterbitkan!'
          : 'Artikel diubah menjadi Draft.'
      );
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = InsightsService.toggleArticleFeatured(id);
    if (updated) {
      showToast(
        updated.featured
          ? 'Artikel ditandai sebagai Featured.'
          : 'Status Featured dicabut.'
      );
    }
  };

  // Delete
  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Yakin ingin menghapus artikel "${title}"?`)) {
      InsightsService.deleteArticle(id);
      showToast('Artikel berhasil dihapus.');
    }
  };

  // Auto-slug from title
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const isNew = !editingArticleId;
      const shouldUpdateSlug = isNew || !prev.slug;
      return {
        ...prev,
        title: val,
        slug: shouldUpdateSlug
          ? val
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
          : prev.slug,
      };
    });
  };

  // Helper for quick formatting in content editor
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('cms-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.content;
    const selected = current.substring(start, end) || 'Teks contoh';
    const replacement = `${prefix}${selected}${suffix}`;

    const newContent = current.substring(0, start) + replacement + current.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Filtered Articles in list
  const filteredArticles = articles.filter((a) => {
    if (filterCategory !== 'ALL' && a.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Metrics summary
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const featuredCount = articles.filter((a) => a.featured).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#0B1F33]/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-4 right-4 z-50 bg-[#0B1F33] text-white px-4 py-2.5 rounded-md shadow-lg text-xs font-semibold flex items-center gap-2 border border-[#B59A5A]">
            <CheckCircle className="w-4 h-4 text-[#B59A5A]" />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-[#0B1F33] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#B59A5A] text-[#0B1F33] flex items-center justify-center font-bold font-mono text-xs">
              CMS
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B59A5A] block">
                ARUNA EDITORIAL SYSTEM
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Content Management System — Insights
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && viewMode === 'editor' && (
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors"
              >
                ← Kembali ke Daftar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {!isAuthenticated ? (
            /* Login Gate */
            <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl border border-[#E5E7EB] shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#E5E7EB] text-[#B59A5A] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0B1F33] mb-1">
                Akses Administrator Editorial
              </h4>
              <p className="text-xs text-[#6B7280] mb-6">
                Masukkan passcode editorial untuk mengelola artikel, publikasi, dan draft ARUNA Insights.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                {authError && (
                  <div className="p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded text-left">
                    {authError}
                  </div>
                )}
                <div>
                  <input
                    type="password"
                    autoFocus
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Masukkan Passcode (e.g. aruna2026)"
                    className="w-full px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Buka Akses CMS</span>
                </button>
                <p className="text-[11px] text-[#6B7280]">
                  Default passcode tim: <code className="bg-[#E5E7EB] px-1 py-0.5 rounded font-mono">aruna2026</code>
                </p>
              </form>
            </div>
          ) : viewMode === 'list' ? (
            /* View 1: Articles List & Dashboard */
            <div>
              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                  <span className="text-[11px] text-[#6B7280] uppercase tracking-wider block font-semibold">
                    Total Artikel
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#0B1F33]">
                    {totalCount}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                  <span className="text-[11px] text-emerald-700 uppercase tracking-wider block font-semibold">
                    Published
                  </span>
                  <span className="text-2xl font-bold font-mono text-emerald-700">
                    {publishedCount}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                  <span className="text-[11px] text-amber-700 uppercase tracking-wider block font-semibold">
                    Drafts
                  </span>
                  <span className="text-2xl font-bold font-mono text-amber-700">
                    {draftCount}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                  <span className="text-[11px] text-[#B59A5A] uppercase tracking-wider block font-semibold">
                    Featured
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#B59A5A]">
                    {featuredCount}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul, kategori, konten..."
                      className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] w-48 sm:w-64"
                    />
                  </div>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden"
                  >
                    <option value="ALL">Semua Kategori</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Reset ulang data artikel ke 5 artikel default ARUNA?')) {
                        InsightsService.resetToInitial();
                        showToast('Data direset ke bawaan.');
                      }
                    }}
                    title="Reset ke artikel awal"
                    className="p-2 text-xs text-[#6B7280] hover:text-[#0B1F33] bg-white border border-[#E5E7EB] rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenNew}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tulis Artikel Baru</span>
                  </button>
                </div>
              </div>

              {/* Articles Table */}
              <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F6F7] border-b border-[#E5E7EB] font-bold text-[#6B7280] uppercase tracking-wider">
                        <th className="p-4 w-1/2">Artikel</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Tanggal</th>
                        <th className="p-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {filteredArticles.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-[#6B7280]">
                            Tidak ada artikel yang sesuai dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredArticles.map((art) => (
                          <tr
                            key={art.id}
                            className="hover:bg-[#F5F6F7]/70 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="flex items-start gap-3">
                                {art.coverImage && (
                                  <img
                                    src={art.coverImage}
                                    alt=""
                                    className="w-10 h-10 rounded object-cover shrink-0 border border-[#E5E7EB]"
                                  />
                                )}
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h5 className="font-bold text-[#0B1F33] group-hover:text-[#B59A5A] transition-colors text-sm">
                                      {art.title}
                                    </h5>
                                    {art.featured && (
                                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-[#F5F6F7] text-[#B59A5A] border border-[#B59A5A]/30 rounded">
                                        FEATURED
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[#6B7280] line-clamp-1 text-xs">
                                    {art.excerpt}
                                  </p>
                                  <span className="text-[10px] text-[#6B7280] font-mono mt-0.5 block">
                                    slug: /{art.slug} · {art.readingTime} min
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <span className="font-mono text-[11px] font-semibold text-[#0B1F33] bg-[#F5F6F7] px-2 py-1 rounded border border-[#E5E7EB]">
                                {art.category}
                              </span>
                            </td>

                            <td className="p-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={(e) => handleTogglePublish(art.id, e)}
                                title="Klik untuk ubah status"
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                                  art.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${art.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                                <span className="uppercase">{art.status}</span>
                              </button>
                            </td>

                            <td className="p-4 whitespace-nowrap text-[#6B7280] font-mono text-[11px]">
                              {art.publishedAt || '—'}
                            </td>

                            <td className="p-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleFeatured(art.id, e)}
                                  title={art.featured ? 'Cabut Featured' : 'Jadikan Featured'}
                                  className={`p-1.5 rounded transition-colors ${
                                    art.featured
                                      ? 'text-[#B59A5A] hover:bg-[#B59A5A]/10'
                                      : 'text-[#6B7280] hover:text-[#0B1F33] hover:bg-[#E5E7EB]'
                                  }`}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => onPreviewArticle(art)}
                                  title="Lihat Pratinjau Pembaca"
                                  className="p-1.5 text-[#6B7280] hover:text-[#0B1F33] hover:bg-[#E5E7EB] rounded transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(art)}
                                  title="Edit Artikel"
                                  className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A] hover:bg-[#E5E7EB] rounded transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => handleDelete(art.id, art.title, e)}
                                  title="Hapus Artikel"
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: Article Editor */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                <div>
                  <h4 className="text-lg font-bold text-[#0B1F33]">
                    {editingArticleId ? 'Edit Artikel' : 'Tulis Artikel Baru'}
                  </h4>
                  <span className="text-xs text-[#6B7280]">
                    Tulis wawasan mendalam dengan prinsip "Business first. Software second."
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorPreview(!editorPreview)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B1F33] bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{editorPreview ? 'Kembali ke Editor' : 'Pratinjau Teks'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave('draft')}
                    className="px-4 py-1.5 text-xs font-semibold text-[#0B1F33] bg-white border border-[#E5E7EB] hover:bg-[#F5F6F7] rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave('published')}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Terbitkan (Publish)</span>
                  </button>
                </div>
              </div>

              {editorPreview ? (
                /* Live Preview Mode */
                <div className="bg-white p-8 rounded-xl border border-[#E5E7EB] max-w-3xl mx-auto">
                  <span className="text-xs font-mono font-bold text-[#B59A5A] uppercase tracking-wider block mb-2">
                    {formData.category} · {formData.publishedAt || 'Hari ini'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] mb-4">
                    {formData.title || 'Judul Artikel Kosong'}
                  </h1>
                  <p className="text-base text-[#4B5563] leading-relaxed mb-6 italic">
                    {formData.excerpt || 'Ringkasan artikel...'}
                  </p>
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt=""
                      className="w-full h-64 object-cover rounded-lg mb-6 border border-[#E5E7EB]"
                    />
                  )}
                  <div className="prose prose-slate max-w-none text-sm text-[#334155] whitespace-pre-line leading-relaxed">
                    {formData.content || 'Isi konten artikel masih kosong.'}
                  </div>
                </div>
              ) : (
                /* Form Inputs */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Title, Excerpt, Content */}
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Judul Artikel *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Contoh: ERP Bukan Obat untuk Bisnis yang Berantakan"
                        className="w-full px-3.5 py-2 text-sm border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] font-semibold text-[#0B1F33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Ringkasan / Subtitle (Excerpt) *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Ringkasan 1-2 kalimat yang menarik dan menjelaskan poin utama..."
                        className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                      />
                    </div>

                    {/* Rich Formatting Helper Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-[#0B1F33]">
                          Konten Artikel (Mendukung Markdown / Headings / Quotes) *
                        </label>
                        <div className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                          <button
                            type="button"
                            onClick={() => insertFormatting('### ')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33] font-semibold"
                            title="Subheading H3"
                          >
                            H3
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('**', '**')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33] font-bold"
                            title="Bold"
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('*', '*')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33] italic"
                            title="Italic"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('> **"', '"**')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33]"
                            title="Kutipan (Quote)"
                          >
                            Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('* ')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33]"
                            title="Daftar Poin"
                          >
                            List
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting('\n---\n')}
                            className="px-1.5 py-0.5 bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded text-[#0B1F33]"
                            title="Garis Pemisah"
                          >
                            HR
                          </button>
                        </div>
                      </div>

                      <textarea
                        id="cms-content-area"
                        rows={16}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Tulis artikel di sini. Gunakan ### untuk subjudul, > untuk kutipan penting, dan * untuk poin..."
                        className="w-full px-3.5 py-2.5 text-xs font-mono border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Right Column: Taxonomy, Author, Cover, SEO */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Category Selector */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
                        Kategori Editorial
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ArticleCategory })}
                        className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:outline-hidden font-medium"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Author Selector */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
                        Penulis (Author)
                      </label>
                      <select
                        value={formData.authorId}
                        onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:outline-hidden font-medium"
                      >
                        {authors.map((auth) => (
                          <option key={auth.id} value={auth.id}>
                            {auth.name} ({auth.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Publishing Status & Featured */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#0B1F33]">
                          Status Publikasi
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className={`text-xs px-2 py-1 rounded font-semibold border ${
                            formData.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="draft">DRAFT (Pribadi)</option>
                          <option value="published">PUBLISHED (Tayang Publik)</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                        <span className="text-xs font-semibold text-[#0B1F33]">
                          Tandai Featured Article
                        </span>
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4 rounded text-[#0B1F33]"
                        />
                      </div>

                      <div className="pt-2 border-t border-[#E5E7EB]">
                        <label className="block text-[11px] font-semibold text-[#6B7280] mb-1">
                          Tanggal Publikasi
                        </label>
                        <input
                          type="date"
                          value={formData.publishedAt}
                          onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                          className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7]"
                        />
                      </div>
                    </div>

                    {/* Cover Image Selector */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
                        Gambar Sampul (Cover Image)
                      </label>
                      <input
                        type="text"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="Path gambar atau URL..."
                        className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7] mb-2"
                      />

                      <span className="text-[10px] text-[#6B7280] block mb-1 font-semibold">
                        Atau pilih dari aset ARUNA:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {DEFAULT_COVER_PRESETS.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                            className={`p-1 rounded border text-[10px] truncate transition-colors ${
                              formData.coverImage === preset.url
                                ? 'bg-[#0B1F33] text-white border-[#0B1F33]'
                                : 'bg-[#F5F6F7] text-[#0B1F33] border-[#E5E7EB] hover:bg-[#E5E7EB]'
                            }`}
                            title={preset.label}
                          >
                            {preset.label.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slug & SEO */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] space-y-2">
                      <span className="text-xs font-semibold text-[#0B1F33] block">
                        Optimasi SEO & URL
                      </span>

                      <div>
                        <label className="block text-[11px] text-[#6B7280]">URL Slug</label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="slug-artikel"
                          className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#6B7280]">SEO Title</label>
                        <input
                          type="text"
                          value={formData.seoTitle}
                          onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                          placeholder="Judul SEO..."
                          className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#6B7280]">SEO Description</label>
                        <input
                          type="text"
                          value={formData.seoDescription}
                          onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                          placeholder="Deskripsi mesin pencari..."
                          className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
