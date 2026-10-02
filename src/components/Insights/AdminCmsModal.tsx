import React, { useState, useEffect, useRef } from 'react';
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
  Upload,
  Image as ImageIcon,
  Users,
  FolderTree,
  Database,
  LogOut,
  AlertCircle,
  Check,
  Copy,
  Layers,
} from 'lucide-react';
import { Article, ArticleCategory, Author, Category, SiteMedia, Profile } from '../../types';
import { ArticlesService, subscribeToArticles } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { CategoriesService } from '../../services/supabase/categoriesService';
import { MediaService } from '../../services/supabase/mediaService';
import { AuthService } from '../../services/supabase/authService';
import { MigrationService, MigrationResult } from '../../services/supabase/migrationService';
import { SUPABASE_CONFIG_INFO, isSupabaseConfigured } from '../../services/supabase/client';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewArticle: (article: Article) => void;
}

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
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Login form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // CMS Navigation Tab: 'articles' | 'media' | 'authors' | 'database'
  const [activeTab, setActiveTab] = useState<'articles' | 'media' | 'authors' | 'database'>('articles');

  // Articles & Database state
  const [articles, setArticles] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteMedia, setSiteMedia] = useState<SiteMedia[]>([]);
  const [dataCounts, setDataCounts] = useState<{ articles: number; authors: number; categories: number; media: number }>({
    articles: 0,
    authors: 0,
    categories: 0,
    media: 0,
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Editor mode state: 'list' | 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // Media Upload state
  const [uploadProgress, setUploadProgress] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  // Migration status
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Check Supabase session on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function checkAuth() {
      setIsAuthLoading(true);
      try {
        const session = await AuthService.getSession();
        if (isMounted && session?.user) {
          const profile = await AuthService.getUserProfile(session.user.id);
          if (profile && (profile.role === 'admin' || profile.role === 'editor')) {
            setCurrentUser(session.user);
            setCurrentProfile(profile);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Auth verification error:', err);
      } finally {
        if (isMounted) setIsAuthLoading(false);
      }
    }

    checkAuth();
  }, [isOpen]);

  // Load CMS data from Supabase
  const loadCmsData = async () => {
    try {
      const [artList, authList, catList, medList, counts] = await Promise.all([
        ArticlesService.getAllArticles(),
        AuthorsService.getAuthors(false),
        CategoriesService.getCategories(false),
        MediaService.getAllMedia(),
        MigrationService.checkSupabaseDataCount(),
      ]);

      setArticles(artList);
      setAuthors(authList);
      setCategories(catList);
      setSiteMedia(medList);
      setDataCounts(counts);
    } catch (err) {
      console.error('Error loading CMS data:', err);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadCmsData();
      return subscribeToArticles(loadCmsData);
    }
  }, [isOpen, isAuthenticated]);

  // Handle Supabase Auth Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccessMsg('');
    setIsSubmittingAuth(true);

    if (!authEmail.trim() || !authPassword) {
      setAuthError('Email dan password wajib diisi.');
      setIsSubmittingAuth(false);
      return;
    }

    try {
      if (isSignUpMode) {
        // Sign up editorial user
        const { user, session, error } = await AuthService.signUp(
          authEmail,
          authPassword,
          authFullName || authEmail.split('@')[0]
        );

        if (error) {
          setAuthError(error.message);
          return;
        }

        if (session && user) {
          const profile = await AuthService.getUserProfile(user.id);
          setCurrentUser(user);
          setCurrentProfile(profile);
          setIsAuthenticated(true);
          showToast(`Selamat datang, ${profile?.fullName || user.email}!`);
        } else {
          setAuthSuccessMsg(
            'Pendaftaran berhasil! Akun editorial telah dibuat di Supabase. Silakan cek email Anda untuk konfirmasi, atau hubungi administrator untuk promosi peran.'
          );
          setIsSignUpMode(false);
        }
      } else {
        // Sign in via Supabase Auth
        const { user, profile, error } = await AuthService.signIn(authEmail, authPassword);

        if (error) {
          setAuthError(error.message || 'Login gagal. Periksa kembali email dan password.');
          return;
        }

        if (!user) {
          setAuthError('Pengguna tidak ditemukan.');
          return;
        }

        setCurrentUser(user);
        setCurrentProfile(profile);
        setIsAuthenticated(true);
        showToast(`Login berhasil sebagai ${profile?.role?.toUpperCase() || 'STAFF'}`);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Terjadi kesalahan sistem autentikasi.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await AuthService.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentProfile(null);
    setViewMode('list');
    showToast('Anda telah keluar dari CMS.');
  };

  // Run Baseline Migration / Seed
  const handleRunMigration = async () => {
    if (!confirm('Sinkronkan artikel default, penulis, kategori, dan media ke database Supabase?')) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);

    try {
      const res = await MigrationService.runMigration();
      setMigrationResult(res);
      if (res.success) {
        showToast(res.message);
        await loadCmsData();
      }
    } catch (err: any) {
      showToast('Gagal menjalankan sinkronisasi data.');
    } finally {
      setIsMigrating(false);
    }
  };

  // Open editor for new article
  const handleOpenNew = () => {
    const today = new Date().toISOString().substring(0, 10);
    const defaultAuthor = authors[0]?.id || '11111111-1111-1111-1111-111111111111';

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

  // Handle Save article
  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      alert('Judul artikel wajib diisi.');
      return;
    }

    setIsSaving(true);
    const calculatedWords = formData.content.split(/\s+/).filter(Boolean).length;
    const estReadingTime = Math.max(1, Math.round(calculatedWords / 200));

    const generatedSlug =
      formData.slug.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

    const statusToSave = targetStatus || formData.status;

    try {
      if (editingArticleId) {
        // Update existing article in Supabase
        const { error } = await ArticlesService.updateArticle(editingArticleId, {
          title: formData.title.trim(),
          slug: generatedSlug,
          excerpt: formData.excerpt.trim(),
          category: formData.category,
          authorId: formData.authorId,
          content: formData.content,
          coverImage: formData.coverImage,
          coverImageUrl: formData.coverImage,
          status: statusToSave,
          featured: formData.featured,
          publishedAt:
            statusToSave === 'published' && !formData.publishedAt
              ? new Date().toISOString().substring(0, 10)
              : formData.publishedAt,
          seoTitle: formData.seoTitle.trim() || `${formData.title} | ARUNA Insights`,
          seoDescription: formData.seoDescription.trim() || formData.excerpt,
        });

        if (error) {
          alert(`Gagal memperbarui artikel: ${error.message}`);
          setIsSaving(false);
          return;
        }

        showToast(
          statusToSave === 'published'
            ? 'Artikel berhasil diterbitkan ke Supabase!'
            : 'Draft artikel berhasil diperbarui di Supabase!'
        );
      } else {
        // Create new article in Supabase
        const { article, error } = await ArticlesService.createArticle({
          title: formData.title.trim(),
          slug: generatedSlug,
          excerpt: formData.excerpt.trim(),
          category: formData.category,
          authorId: formData.authorId,
          content: formData.content,
          coverImage: formData.coverImage,
          coverImageUrl: formData.coverImage,
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

        if (error || !article) {
          alert(`Gagal menyimpan artikel baru: ${error?.message || 'Unknown error'}`);
          setIsSaving(false);
          return;
        }

        showToast(
          statusToSave === 'published'
            ? 'Artikel baru berhasil dibuat dan diterbitkan!'
            : 'Draft artikel baru berhasil disimpan di Supabase!'
        );
      }

      await loadCmsData();
      setViewMode('list');
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message || String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish
  const handleTogglePublish = async (art: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = art.status === 'published' ? 'draft' : 'published';
    const { error } = await ArticlesService.updateArticle(art.id, { status: newStatus });
    if (!error) {
      showToast(newStatus === 'published' ? 'Artikel diterbitkan!' : 'Artikel diubah ke Draft.');
      await loadCmsData();
    } else {
      showToast(`Gagal: ${error.message}`);
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (art: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFeatured = !art.featured;
    const { error } = await ArticlesService.toggleFeatured(art.id, newFeatured);
    if (!error) {
      showToast(newFeatured ? 'Artikel ditandai sebagai Featured.' : 'Status Featured dicabut.');
      await loadCmsData();
    } else {
      showToast(`Gagal: ${error.message}`);
    }
  };

  // Delete article
  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Yakin ingin menghapus artikel "${title}" dari Supabase?`)) {
      const { error } = await ArticlesService.deleteArticle(id);
      if (!error) {
        showToast('Artikel berhasil dihapus dari database.');
        await loadCmsData();
      } else {
        alert(`Gagal menghapus: ${error.message}`);
      }
    }
  };

  // Upload image for cover directly to Supabase Storage
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    try {
      const { media, publicUrl, error } = await MediaService.uploadMedia(file, 'insights', {
        name: `Cover ${formData.title || file.name}`,
        section: 'insights',
      });

      if (error) {
        alert(`Gagal upload cover: ${error.message}`);
      } else if (publicUrl) {
        setFormData((prev) => ({ ...prev, coverImage: publicUrl }));
        showToast('Gambar cover berhasil diunggah ke bucket aruna-media!');
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadProgress(false);
      if (editorImageInputRef.current) editorImageInputRef.current.value = '';
    }
  };

  // Standalone Media Upload (Tab 2)
  const handleStandaloneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(true);
    setMediaUploadError(null);

    try {
      const { media, publicUrl, error } = await MediaService.uploadMedia(file, 'general', {
        name: file.name.split('.')[0],
        section: 'general',
      });

      if (error) {
        setMediaUploadError(error.message);
      } else {
        showToast('Media berhasil diunggah ke storage aruna-media!');
        await loadCmsData();
      }
    } catch (err: any) {
      setMediaUploadError(err.message || 'Gagal mengunggah media.');
    } finally {
      setUploadProgress(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Copy string to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Teks disalin ke papan klip!');
  };

  // Filtered Articles
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

  if (!isOpen) return null;

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
        <div className="p-4 sm:p-6 bg-[#0B1F33] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#B59A5A] text-[#0B1F33] flex items-center justify-center font-bold font-mono text-xs">
              CMS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B59A5A]">
                  ARUNA EDITORIAL SYSTEM
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SUPABASE ACTIVE
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                Content Management System — Production Database
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && currentProfile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white/90">{currentProfile.fullName}</span>
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#B59A5A] text-[#0B1F33]">
                  {currentProfile.role}
                </span>
              </div>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari CMS"
                className="p-1.5 text-white/70 hover:text-rose-300 hover:bg-white/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

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
            /* Login Gate: Supabase Auth Login */
            <div className="max-w-md mx-auto my-8 p-8 bg-white rounded-xl border border-[#E5E7EB] shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-[#F5F6F7] border border-[#E5E7EB] text-[#B59A5A] flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0B1F33] mb-1">
                {isSignUpMode ? 'Daftar Akun Editorial Baru' : 'Akses Administrator Editorial'}
              </h4>
              <p className="text-xs text-[#6B7280] mb-6">
                {isSignUpMode
                  ? 'Daftarkan email Anda untuk mendapatkan hak akses editor ARUNA Insights di Supabase.'
                  : 'Masuk menggunakan kredensial Supabase Auth untuk mengelola konten dan media.'}
              </p>

              {authError && (
                <div className="mb-4 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="mb-4 p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md text-left flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-left">
                {isSignUpMode && (
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g. Ahmad Staff"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    Email Akun
                  </label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="admin@aruna.id"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingAuth}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] disabled:opacity-50 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>
                    {isSubmittingAuth
                      ? 'Memproses...'
                      : isSignUpMode
                      ? 'Daftarkan Akun Editorial'
                      : 'Masuk dengan Supabase Auth'}
                  </span>
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUpMode(!isSignUpMode);
                      setAuthError('');
                      setAuthSuccessMsg('');
                    }}
                    className="text-xs text-[#6B7280] hover:text-[#0B1F33] underline"
                  >
                    {isSignUpMode
                      ? 'Sudah punya akun? Masuk di sini'
                      : 'Belum punya akun editorial? Buat akun di sini'}
                  </button>
                </div>

                <div className="p-3 bg-[#F5F6F7] rounded-md border border-[#E5E7EB] text-[11px] text-[#6B7280] leading-relaxed">
                  <span className="font-semibold text-[#0B1F33] block mb-0.5">Catatan Keamanan Supabase RLS:</span>
                  Setiap akun yang baru didaftarkan secara otomatis diberikan peran <code className="font-mono bg-white px-1 py-0.5 rounded border text-[#0B1F33]">editor</code> oleh trigger database. Untuk promosi peran ke <code className="font-mono bg-white px-1 py-0.5 rounded border text-[#0B1F33]">admin</code>, jalankan SQL query bootstrap di Supabase SQL Editor.
                </div>
              </form>
            </div>
          ) : viewMode === 'list' ? (
            /* View 1: Main CMS Dashboard with Tabs */
            <div>
              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 mb-6 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'articles'
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-[#F5F6F7] text-[#6B7280] hover:text-[#0B1F33] hover:bg-white border border-[#E5E7EB]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Artikel & Insights ({totalCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'media'
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-[#F5F6F7] text-[#6B7280] hover:text-[#0B1F33] hover:bg-white border border-[#E5E7EB]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Media & Storage ({siteMedia.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('authors')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'authors'
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-[#F5F6F7] text-[#6B7280] hover:text-[#0B1F33] hover:bg-white border border-[#E5E7EB]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Penulis & Kategori ({authors.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'database'
                      ? 'bg-[#0B1F33] text-white shadow-xs'
                      : 'bg-[#F5F6F7] text-[#6B7280] hover:text-[#0B1F33] hover:bg-white border border-[#E5E7EB]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Status Supabase & Sync</span>
                </button>
              </div>

              {/* TAB 1: ARTICLES */}
              {activeTab === 'articles' && (
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
                          placeholder="Cari judul, kategori..."
                          className="pl-8 pr-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] w-48 sm:w-64"
                        />
                      </div>

                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden"
                      >
                        <option value="ALL">Semua Kategori</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={loadCmsData}
                        title="Segarkan Data dari Supabase"
                        className="p-2 text-xs text-[#6B7280] hover:text-[#0B1F33] bg-white border border-[#E5E7EB] rounded-md transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenNew}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors shadow-xs cursor-pointer"
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
                              <tr key={art.id} className="hover:bg-[#F5F6F7]/70 transition-colors group">
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
                                    onClick={(e) => handleTogglePublish(art, e)}
                                    title="Klik untuk ubah status di Supabase"
                                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                                      art.status === 'published'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        art.status === 'published' ? 'bg-emerald-600' : 'bg-amber-600'
                                      }`}
                                    />
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
                                      onClick={(e) => handleToggleFeatured(art, e)}
                                      title={art.featured ? 'Cabut Featured' : 'Jadikan Featured'}
                                      className={`p-1.5 rounded transition-colors cursor-pointer ${
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
                                      className="p-1.5 text-[#6B7280] hover:text-[#0B1F33] hover:bg-[#E5E7EB] rounded transition-colors cursor-pointer"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(art)}
                                      title="Edit Artikel"
                                      className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A] hover:bg-[#E5E7EB] rounded transition-colors cursor-pointer"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleDelete(art.id, art.title, e)}
                                      title="Hapus dari Supabase"
                                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
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
              )}

              {/* TAB 2: MEDIA & STORAGE (ARUNA-MEDIA BUCKET) */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Media Upload Banner */}
                  <div className="p-6 rounded-xl bg-[#F5F6F7] border border-[#E5E7EB]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#0B1F33]">
                          Supabase Storage — Bucket: <code className="font-mono text-[#B59A5A]">aruna-media</code>
                        </h4>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          Unggah aset gambar JPG, PNG, WEBP untuk artikel atau visual situs web (Maks. 5MB).
                        </p>
                      </div>

                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleStandaloneUpload}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadProgress}
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] disabled:opacity-50 rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadProgress ? 'Mengunggah...' : 'Unggah File Media'}</span>
                        </button>
                      </div>
                    </div>

                    {mediaUploadError && (
                      <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded">
                        {mediaUploadError}
                      </div>
                    )}
                  </div>

                  {/* Registered Site Media Grid */}
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B7280] mb-4">
                      Aset Terdaftar di public.site_media ({siteMedia.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {siteMedia.map((m) => (
                        <div
                          key={m.id}
                          className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden p-3 flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#0B1F33]/5 mb-3 border border-[#E5E7EB] relative">
                              <img
                                src={m.publicUrl}
                                alt={m.altText || m.name}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1F33]/80 text-white uppercase font-bold">
                                {m.section}
                              </span>
                            </div>

                            <h5 className="font-bold text-xs text-[#0B1F33] mb-0.5">{m.name}</h5>
                            <p className="text-[11px] text-[#6B7280] line-clamp-1 mb-2">
                              {m.description || m.storagePath}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                            <span className="font-mono text-[10px] text-[#6B7280] truncate max-w-[150px]">
                              {m.slug}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => copyToClipboard(m.publicUrl)}
                                title="Salin Public URL"
                                className="p-1 text-[#6B7280] hover:text-[#0B1F33] hover:bg-[#F5F6F7] rounded cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={m.publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Buka URL"
                                className="p-1 text-[#6B7280] hover:text-[#0B1F33] hover:bg-[#F5F6F7] rounded"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AUTHORS & CATEGORIES */}
              {activeTab === 'authors' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Authors List */}
                  <div className="p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#0B1F33] flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#B59A5A]" />
                        <span>Penulis (public.authors)</span>
                      </h4>
                      <span className="text-xs font-mono bg-[#F5F6F7] px-2 py-0.5 rounded border text-[#0B1F33]">
                        {authors.length} Penulis
                      </span>
                    </div>

                    <div className="space-y-3">
                      {authors.map((auth) => (
                        <div
                          key={auth.id}
                          className="p-3.5 rounded-lg border border-[#E5E7EB] bg-[#F5F6F7]/50 flex items-start gap-3"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#0B1F33] shrink-0 border border-[#E5E7EB]">
                            <img
                              src={auth.photoUrl || auth.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-xs text-[#0B1F33]">{auth.name}</h5>
                            <p className="text-[11px] text-[#6B7280] line-clamp-2 mt-0.5">
                              {auth.bio}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories List */}
                  <div className="p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-[#0B1F33] flex items-center gap-2">
                        <FolderTree className="w-4 h-4 text-[#B59A5A]" />
                        <span>Kategori Artikel (public.categories)</span>
                      </h4>
                      <span className="text-xs font-mono bg-[#F5F6F7] px-2 py-0.5 rounded border text-[#0B1F33]">
                        {categories.length} Kategori
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="p-3 rounded-lg border border-[#E5E7EB] bg-[#F5F6F7]/50 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-mono text-xs font-bold text-[#0B1F33]">
                              {cat.name}
                            </span>
                            <p className="text-[11px] text-[#6B7280]">{cat.description}</p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            ACTIVE
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATABASE & SYNC STATUS */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Terhubung ke Supabase Production</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                        <span className="text-[#6B7280] block text-[10px] uppercase">Supabase Endpoint</span>
                        <span className="text-[#0B1F33] font-bold break-all">{SUPABASE_CONFIG_INFO.url}</span>
                      </div>
                      <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                        <span className="text-[#6B7280] block text-[10px] uppercase">Storage Bucket</span>
                        <span className="text-[#0B1F33] font-bold">aruna-media (Public RLS)</span>
                      </div>
                    </div>

                    {/* Table Statistics */}
                    <div className="pt-2">
                      <h5 className="text-xs font-semibold text-[#0B1F33] mb-3">
                        Jumlah Baris Data Riil di PostgreSQL:
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#6B7280] uppercase block">public.articles</span>
                          <span className="text-xl font-bold font-mono text-[#0B1F33]">
                            {dataCounts.articles}
                          </span>
                        </div>
                        <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#6B7280] uppercase block">public.authors</span>
                          <span className="text-xl font-bold font-mono text-[#0B1F33]">
                            {dataCounts.authors}
                          </span>
                        </div>
                        <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#6B7280] uppercase block">public.categories</span>
                          <span className="text-xl font-bold font-mono text-[#0B1F33]">
                            {dataCounts.categories}
                          </span>
                        </div>
                        <div className="p-3 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                          <span className="text-[10px] text-[#6B7280] uppercase block">public.site_media</span>
                          <span className="text-xl font-bold font-mono text-[#0B1F33]">
                            {dataCounts.media}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Data Sync & Migration Button */}
                    <div className="p-4 rounded-lg bg-[#F5F6F7] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                      <div>
                        <h5 className="font-bold text-xs text-[#0B1F33]">
                          Sinkronisasi / Seed Data Awal ke Supabase
                        </h5>
                        <p className="text-[11px] text-[#6B7280]">
                          Jika tabel artikel di Supabase masih kosong, jalankan sinkronisasi ini untuk memasukkan 3 artikel editorial awal dan master data.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isMigrating}
                        onClick={handleRunMigration}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] disabled:opacity-50 rounded-md transition-colors whitespace-nowrap cursor-pointer shrink-0"
                      >
                        {isMigrating ? 'Menyinkronkan...' : 'Sinkronkan Data Awal'}
                      </button>
                    </div>

                    {migrationResult && (
                      <div
                        className={`p-3 rounded-md text-xs border ${
                          migrationResult.success
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <p className="font-semibold">{migrationResult.message}</p>
                        {migrationResult.errors.length > 0 && (
                          <ul className="mt-1 list-disc pl-4 space-y-0.5">
                            {migrationResult.errors.map((e, idx) => (
                              <li key={idx}>{e}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* View 2: Article Editor (Connected to Supabase ArticlesService) */
            <div className="space-y-6">
              {/* Editor Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B59A5A] block">
                    {editingArticleId ? 'MODE EDIT ARTIKEL' : 'MODE TULIS ARTIKEL BARU'}
                  </span>
                  <h4 className="text-lg font-bold text-[#0B1F33]">
                    {formData.title || 'Artikel Tanpa Judul'}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorPreview(!editorPreview)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0B1F33] bg-[#F5F6F7] hover:bg-[#E5E7EB] border border-[#E5E7EB] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>{editorPreview ? 'Mode Tulis' : 'Pratinjau'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave('draft')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1F33] bg-white hover:bg-[#F5F6F7] border border-[#E5E7EB] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan Draft'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSave('published')}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0B1F33] hover:bg-[#132D47] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B59A5A]" />
                    <span>{isSaving ? 'Menerbitkan...' : 'Terbitkan Sekarang'}</span>
                  </button>
                </div>
              </div>

              {/* Editor Workspace */}
              {editorPreview ? (
                /* Markdown Preview Mode */
                <div className="p-8 rounded-xl bg-white border border-[#E5E7EB] shadow-xs max-w-3xl mx-auto space-y-6">
                  {formData.coverImage && (
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#0B1F33]/5 border border-[#E5E7EB]">
                      <img src={formData.coverImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase text-[#B59A5A] px-2 py-0.5 rounded bg-[#F5F6F7] border border-[#E5E7EB]">
                      {formData.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F33] leading-snug">
                      {formData.title || 'Judul artikel'}
                    </h1>
                    <p className="text-sm text-[#6B7280] leading-relaxed italic border-l-2 border-[#B59A5A] pl-3">
                      {formData.excerpt || 'Ringkasan artikel...'}
                    </p>
                  </div>

                  <div className="prose prose-sm max-w-none text-[#0B1F33] whitespace-pre-wrap leading-relaxed pt-4 border-t border-[#E5E7EB]">
                    {formData.content || 'Isi artikel kosong.'}
                  </div>
                </div>
              ) : (
                /* Standard Form Writing Mode */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Main Content (8 cols) */}
                  <div className="lg:col-span-8 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Judul Artikel *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. ERP Tidak Akan Memperbaiki Proses Bisnis yang Berantakan"
                        className="w-full px-3.5 py-2.5 text-sm font-semibold border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Ringkasan / Excerpt *
                      </label>
                      <textarea
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="1-2 kalimat pengantar artikel yang kuat..."
                        className="w-full px-3.5 py-2 text-xs border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1">
                        Konten Artikel (Mendukung Format Teks & Paragraf)
                      </label>
                      <textarea
                        id="cms-content-area"
                        rows={14}
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Tuliskan materi artikel di sini..."
                        className="w-full px-4 py-3 text-xs leading-relaxed border border-[#E5E7EB] rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] font-sans"
                      />
                    </div>
                  </div>

                  {/* Right: Meta & Settings Sidebar (4 cols) */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Category Selector */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                      <label className="block text-xs font-semibold text-[#0B1F33] mb-1.5">
                        Kategori Artikel
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-md bg-[#F5F6F7] focus:outline-hidden font-medium"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
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
                            {auth.name}
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

                    {/* Cover Image Selector & Supabase Upload */}
                    <div className="p-4 rounded-lg bg-white border border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#0B1F33]">
                          Gambar Sampul (Cover)
                        </label>
                        <input
                          type="file"
                          ref={editorImageInputRef}
                          onChange={handleCoverImageUpload}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadProgress}
                          onClick={() => editorImageInputRef.current?.click()}
                          className="text-[10px] font-semibold text-[#B59A5A] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{uploadProgress ? 'Mengunggah...' : 'Upload ke Storage'}</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={formData.coverImage}
                        onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                        placeholder="URL gambar atau path storage..."
                        className="w-full px-2.5 py-1 text-xs border border-[#E5E7EB] rounded bg-[#F5F6F7] mb-2"
                      />

                      {formData.coverImage && (
                        <div className="aspect-[16/9] w-full rounded overflow-hidden bg-[#F5F6F7] mb-2 border border-[#E5E7EB]">
                          <img src={formData.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <span className="text-[10px] text-[#6B7280] block mb-1 font-semibold">
                        Atau pilih dari preset ARUNA:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {DEFAULT_COVER_PRESETS.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                            className={`p-1 rounded border text-[10px] truncate transition-colors cursor-pointer ${
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
