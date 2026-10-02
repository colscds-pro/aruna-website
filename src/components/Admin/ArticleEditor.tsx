import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Trash2,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Tag
} from 'lucide-react';
import { Article, Author, Category } from '../../types';
import { ArticlesService, slugifyTitle, estimateReadingTime } from '../../services/supabase/articlesService';
import { AuthorsService } from '../../services/supabase/authorsService';
import { CategoriesService } from '../../services/supabase/categoriesService';
import { MediaService } from '../../services/supabase/mediaService';

interface ArticleEditorProps {
  articleId?: string | null;
  onBack: () => void;
  onSaved: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ articleId, onBack, onSaved }) => {
  const isEditing = Boolean(articleId);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverAltText, setCoverAltText] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryName, setCategoryName] = useState('BUSINESS');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [featured, setFeatured] = useState(false);

  // Reference lists
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function loadInitial() {
      setIsLoading(true);
      try {
        const [authList, catList] = await Promise.all([
          AuthorsService.getAuthors(false),
          CategoriesService.getCategories(false),
        ]);
        setAuthors(authList);
        setCategories(catList);

        if (authList.length > 0 && !authorId) {
          setAuthorId(authList[0].id);
        }
        if (catList.length > 0 && !categoryName) {
          setCategoryName(catList[0].name);
        }

        if (articleId) {
          const all = await ArticlesService.getAllArticles();
          const art = all.find((a) => a.id === articleId);
          if (art) {
            setTitle(art.title);
            setSlug(art.slug);
            setIsSlugCustom(true);
            setExcerpt(art.excerpt);
            setContent(art.content);
            setCoverImageUrl(art.coverImageUrl || art.coverImage);
            setAuthorId(art.authorId);
            setCategoryName(art.category);
            setStatus(art.status);
            setFeatured(art.featured);
          }
        }
      } catch (err) {
        console.error('Error loading article editor data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitial();
  }, [articleId]);

  // Auto-slug when title changes (unless manually customized)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(slugifyTitle(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugifyTitle(val));
    setIsSlugCustom(true);
  };

  // Content formatting toolbar
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-input') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'teks';
    const replacement = `${prefix}${selected}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  // Image Upload handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { publicUrl, error } = await MediaService.uploadMedia(file, 'insights', {
        name: `Cover: ${title || file.name}`,
        altText: coverAltText || title,
        section: 'insights',
      });

      if (error) {
        setNotification({ type: 'error', message: `Gagal mengunggah foto: ${error.message}` });
      } else if (publicUrl) {
        setCoverImageUrl(publicUrl);
        setNotification({ type: 'success', message: 'Foto sampul berhasil diunggah.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal mengunggah foto.' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save handler
  const handleSave = async (targetStatus?: 'draft' | 'published') => {
    if (!title.trim()) {
      setNotification({ type: 'error', message: 'Judul artikel wajib diisi.' });
      return;
    }

    const finalStatus = targetStatus || status;
    setIsLoading(true);
    setNotification(null);

    const payload: Partial<Article> = {
      title: title.trim(),
      slug: slug || slugifyTitle(title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      coverImage: coverImageUrl,
      coverImageUrl,
      authorId,
      category: categoryName,
      status: finalStatus,
      featured,
    };

    try {
      let result;
      if (isEditing && articleId) {
        result = await ArticlesService.updateArticle(articleId, payload);
      } else {
        result = await ArticlesService.createArticle(payload);
      }

      if (result.error) {
        setNotification({ type: 'error', message: result.error.message || 'Gagal menyimpan artikel.' });
      } else {
        setNotification({
          type: 'success',
          message: finalStatus === 'published' ? 'Artikel berhasil dipublikasikan.' : 'Draft artikel berhasil disimpan.',
        });
        setTimeout(() => {
          onSaved();
        }, 800);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Terjadi kesalahan sistem.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#EAECF0]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#0B1F33] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Artikel</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md border transition-colors cursor-pointer flex items-center gap-1.5 ${
              previewMode
                ? 'bg-[#0B1F33] text-white border-[#0B1F33]'
                : 'bg-white text-[#0B1F33] border-[#EAECF0] hover:bg-[#F5F6F7]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Mode Editor' : 'Pratinjau'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold rounded-md bg-white border border-[#EAECF0] text-[#0B1F33] hover:bg-[#F5F6F7] transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#667085]" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isLoading}
            className="px-5 py-2 text-xs font-semibold rounded-md bg-[#0B1F33] text-white hover:bg-[#132D47] transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-[#B59A5A]" />
            <span>{status === 'published' ? 'Perbarui Publikasi' : 'Publikasikan'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-white rounded-2xl border border-[#EAECF0] p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#B59A5A] font-bold uppercase tracking-wider">
            <span>{categoryName}</span>
            <span>·</span>
            <span>{estimateReadingTime(content)} min baca</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#0B1F33] leading-tight mb-4">
            {title || 'Judul Artikel Belum Diisi'}
          </h1>

          <p className="text-base text-[#667085] leading-relaxed mb-8 font-medium italic border-l-2 border-[#B59A5A] pl-4">
            {excerpt || 'Ringkasan artikel...'}
          </p>

          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-72 object-cover rounded-xl mb-8 border border-[#EAECF0]"
            />
          )}

          <div className="prose prose-slate max-w-none text-sm text-[#0B1F33] leading-relaxed whitespace-pre-wrap">
            {content || 'Konten artikel belum ditulis...'}
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <label className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider mb-2">
                Judul Artikel <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Contoh: Kapan Owner Harus Berhenti Mengandalkan Excel?"
                className="w-full px-4 py-3 text-lg font-bold text-[#0B1F33] border border-[#EAECF0] rounded-lg bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33]"
              />

              {/* Slug */}
              <div className="mt-3 flex items-center gap-2 text-xs text-[#667085]">
                <span className="font-mono text-[11px] text-[#667085] shrink-0">Slug URL: /</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="slug-otomatis"
                  className="w-full px-2 py-1 text-xs font-mono border border-transparent hover:border-[#EAECF0] focus:border-[#EAECF0] focus:bg-white rounded text-[#0B1F33] bg-transparent"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <label className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider mb-2">
                Ringkasan / Excerpt
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tulis 1–2 kalimat ringkasan inti pesan artikel untuk kartu tampilan dan deskripsi meta..."
                className="w-full px-4 py-3 text-xs sm:text-sm border border-[#EAECF0] rounded-lg bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] leading-relaxed text-[#0B1F33]"
              />
            </div>

            {/* Content with Rich-Text Markdown Toolbar */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider">
                  Konten Artikel
                </label>
                <span className="text-[11px] font-mono text-[#667085]">
                  {estimateReadingTime(content)} menit estimasi baca
                </span>
              </div>

              {/* Markdown Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-[#F5F6F7] rounded-lg border border-[#EAECF0] mb-3 text-xs">
                <button
                  type="button"
                  onClick={() => insertFormatting('### ', '\n')}
                  title="Subjudul (Heading 3)"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  title="Tebal (Bold)"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  title="Miring (Italic)"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <span className="w-px h-4 bg-[#EAECF0] mx-1" />
                <button
                  type="button"
                  onClick={() => insertFormatting('\n* ', '\n')}
                  title="Poin Daftar"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n1. ', '\n')}
                  title="Daftar Bernomor"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n> ', '\n')}
                  title="Kutipan (Quote)"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n---\n')}
                  title="Garis Pembatas"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('[Judul Link](', ')') }
                  title="Sisipkan Tautan"
                  className="p-1.5 hover:bg-white rounded transition-colors text-[#0B1F33] cursor-pointer"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>

              <textarea
                id="article-content-input"
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan analisis, observasi lapangan, atau pemikiran strategis ARUNA di sini..."
                className="w-full px-4 py-3 text-sm font-mono border border-[#EAECF0] rounded-lg bg-[#F5F6F7] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B1F33] leading-relaxed text-[#0B1F33]"
              />
            </div>
          </div>

          {/* Right Settings Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Publication Status & Options */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs space-y-4">
              <span className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider">
                Status Publikasi
              </span>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#F5F6F7] border border-[#EAECF0]">
                <div className="text-xs">
                  <span className="font-bold text-[#0B1F33] block">Status:</span>
                  <span className={status === 'published' ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                    {status === 'published' ? 'Dipublikasikan' : 'Draft Pribadi'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus(status === 'published' ? 'draft' : 'published')}
                  className="text-xs px-2.5 py-1 rounded border border-[#EAECF0] bg-white font-semibold text-[#0B1F33] hover:bg-[#F5F6F7] cursor-pointer"
                >
                  Ubah ke {status === 'published' ? 'Draft' : 'Publish'}
                </button>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F6F7] border border-[#EAECF0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0B1F33] focus:ring-[#0B1F33]"
                />
                <div>
                  <span className="text-xs font-bold text-[#0B1F33] block">Tandai sebagai Featured</span>
                  <span className="text-[11px] text-[#667085]">Ditampilkan di bagian sorotan utama</span>
                </div>
              </label>
            </div>

            {/* Category Select */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <label className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider mb-2">
                Kategori Artikel
              </label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Select */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <label className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider mb-2">
                Penulis
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#EAECF0] rounded-md bg-[#F5F6F7] focus:bg-white text-[#0B1F33]"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image Uploader */}
            <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-xs">
              <label className="block text-xs font-mono font-bold text-[#0B1F33] uppercase tracking-wider mb-2">
                Foto Sampul (Cover Image)
              </label>

              {coverImageUrl ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-[#EAECF0]">
                    <img
                      src={coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1F33] bg-[#F5F6F7] px-3 py-1.5 rounded border border-[#EAECF0] hover:bg-white cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#B59A5A]" />
                      <span>Ganti Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setCoverImageUrl('')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#EAECF0] hover:border-[#0B1F33]/40 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F5F6F7]/50">
                  <ImageIcon className="w-8 h-8 text-[#667085] mb-2" />
                  <span className="text-xs font-semibold text-[#0B1F33]">Pilih Foto Sampul</span>
                  <span className="text-[11px] text-[#667085] mt-0.5">JPG, PNG, atau WEBP (Maks 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </label>
              )}

              {isUploadingImage && (
                <p className="text-[11px] text-[#B59A5A] font-semibold mt-2 animate-pulse">
                  Mengunggah ke Supabase Storage (aruna-media)...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
