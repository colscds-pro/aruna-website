import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Folder,
  Tag,
  Eye,
  Info
} from 'lucide-react';
import { SiteMedia, MediaSection } from '../../types';
import { MediaService } from '../../services/supabase/mediaService';

export const MediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<SiteMedia[]>([]);
  const [selectedSection, setSelectedSection] = useState<MediaSection | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Modals state
  const [previewMedia, setPreviewMedia] = useState<SiteMedia | null>(null);
  const [editMedia, setEditMedia] = useState<SiteMedia | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SiteMedia | null>(null);
  const [usageWarning, setUsageWarning] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const sections: { id: MediaSection | 'all'; label: string }[] = [
    { id: 'all', label: 'Semua Media' },
    { id: 'hero', label: 'Hero Homepage' },
    { id: 'industry', label: 'Industri' },
    { id: 'case-study', label: 'Studi Kasus' },
    { id: 'insights', label: 'Insights & Cover' },
    { id: 'about', label: 'Penulis & Founder' },
    { id: 'general', label: 'Umum' },
  ];

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const data = await MediaService.getAllMedia(selectedSection === 'all' ? undefined : selectedSection);
      setMediaList(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedSection]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setNotification(null);

    const folderMap: Record<string, any> = {
      hero: 'homepage',
      industry: 'industries',
      'case-study': 'case-studies',
      insights: 'insights',
      about: 'authors',
      general: 'general',
      all: 'general',
    };
    const targetFolder = folderMap[selectedSection] || 'general';

    try {
      let uploadedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { error } = await MediaService.uploadMedia(file, targetFolder, {
          name: file.name.split('.')[0],
          section: selectedSection === 'all' ? 'general' : selectedSection,
        });
        if (!error) uploadedCount++;
      }

      setNotification({
        type: 'success',
        message: `${uploadedCount} foto berhasil diunggah ke Supabase Storage (aruna-media).`,
      });
      await loadMedia();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal mengunggah foto.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartDelete = async (media: SiteMedia) => {
    setDeleteTarget(media);
    setUsageWarning([]);

    try {
      const { inUse, references } = await MediaService.checkMediaUsage(media.publicUrl);
      if (inUse) {
        setUsageWarning(references);
      }
    } catch (err) {
      console.error('Error checking usage:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await MediaService.deleteMedia(deleteTarget.id);
      if (error) {
        setNotification({ type: 'error', message: `Gagal menghapus: ${error.message}` });
      } else {
        setNotification({ type: 'success', message: 'Media berhasil dihapus.' });
        setDeleteTarget(null);
        await loadMedia();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal menghapus.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMedia) return;

    try {
      const { error } = await MediaService.updateMetadata(editMedia.id, {
        name: editMedia.name,
        slug: editMedia.slug,
        altText: editMedia.altText,
        description: editMedia.description,
        section: editMedia.section,
      });

      if (error) {
        setNotification({ type: 'error', message: error.message });
      } else {
        setNotification({ type: 'success', message: 'Metadata media berhasil diperbarui.' });
        setEditMedia(null);
        await loadMedia();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
            Pustaka Media Website (Media Library)
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Kelola foto cover artikel, foto profil penulis, dan gambar resmi homepage langsung di Supabase Storage.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132D47] text-white text-xs font-semibold rounded-md transition-colors shadow-xs cursor-pointer self-start sm:self-auto shrink-0">
          <Upload className="w-4 h-4 text-[#B59A5A]" />
          <span>{isUploading ? 'Mengunggah...' : 'Unggah Foto Baru'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-[#EAECF0] rounded-lg shadow-2xs">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSelectedSection(s.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              selectedSection === s.id
                ? 'bg-[#0B1F33] text-white'
                : 'text-[#667085] hover:text-[#0B1F33] hover:bg-[#F5F6F7]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-xl border border-[#EAECF0] p-6 shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#667085]">
            Memuat daftar media...
          </div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ImageIcon className="w-10 h-10 text-[#667085] mx-auto opacity-40" />
            <h4 className="text-sm font-bold text-[#0B1F33]">Belum ada media di kategori ini</h4>
            <p className="text-xs text-[#667085]">
              Klik tombol "Unggah Foto Baru" di atas untuk menambahkan media ke bucket <code>aruna-media</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-lg border border-[#EAECF0] bg-white overflow-hidden hover:border-[#0B1F33]/40 transition-all flex flex-col justify-between shadow-2xs"
              >
                {/* Thumbnail */}
                <div className="aspect-video w-full bg-[#F5F6F7] relative overflow-hidden">
                  <img
                    src={item.publicUrl}
                    alt={item.altText || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-xs p-1 rounded-md">
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(item)}
                      className="p-1 text-white hover:text-[#B59A5A]"
                      title="Lihat Detail"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMedia(item)}
                      className="p-1 text-white hover:text-[#B59A5A]"
                      title="Edit Metadata"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartDelete(item)}
                      className="p-1 text-white hover:text-rose-400"
                      title="Hapus Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3">
                  <span className="font-bold text-xs text-[#0B1F33] block truncate" title={item.name}>
                    {item.name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-[#667085] mt-1 font-mono">
                    <span className="bg-[#F5F6F7] px-1.5 py-0.5 rounded border border-[#EAECF0] uppercase">
                      {item.section}
                    </span>
                    <span>{item.slug}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Metadata Modal */}
      {editMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl border border-[#EAECF0]">
            <h3 className="text-base font-bold text-[#0B1F33] mb-4">Edit Metadata Media</h3>
            <form onSubmit={handleSaveMetadata} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Nama Media</label>
                <input
                  type="text"
                  required
                  value={editMedia.name}
                  onChange={(e) => setEditMedia({ ...editMedia, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Slug Unik</label>
                <input
                  type="text"
                  required
                  value={editMedia.slug}
                  onChange={(e) => setEditMedia({ ...editMedia, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7] font-mono"
                />
                <span className="text-[10px] text-[#667085] mt-1 block">
                  Digunakan untuk mengikat gambar ke homepage atau industri (e.g. hero-consulting-meeting, industry-retail).
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Alt Text (Aksesibilitas)</label>
                <input
                  type="text"
                  value={editMedia.altText || ''}
                  onChange={(e) => setEditMedia({ ...editMedia, altText: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Bagian Website (Section)</label>
                <select
                  value={editMedia.section}
                  onChange={(e) => setEditMedia({ ...editMedia, section: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
                >
                  <option value="hero">Hero Homepage</option>
                  <option value="industry">Industri</option>
                  <option value="case-study">Studi Kasus</option>
                  <option value="insights">Insights & Cover</option>
                  <option value="about">Tentang / Founder</option>
                  <option value="general">Umum</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAECF0]">
                <button
                  type="button"
                  onClick={() => setEditMedia(null)}
                  className="px-4 py-2 border border-[#EAECF0] rounded-md font-semibold text-[#667085]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0B1F33] text-white rounded-md font-semibold hover:bg-[#132D47]"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete with In-Use Reference Warning Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl border border-[#EAECF0]">
            <div className="flex items-center gap-3 mb-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-[#0B1F33]">Hapus Media</h3>
            </div>

            {usageWarning.length > 0 ? (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs mb-4 space-y-1">
                <strong className="block font-bold">Peringatan: Media ini sedang digunakan!</strong>
                <p>Media ini terhubung ke:</p>
                <ul className="list-disc pl-4 space-y-0.5 font-medium">
                  {usageWarning.map((ref, idx) => (
                    <li key={idx}>{ref}</li>
                  ))}
                </ul>
                <p className="pt-1 text-[11px] text-amber-800">
                  Menghapus foto ini akan menyebabkan gambar di halaman terkait tidak muncul.
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#667085] leading-relaxed mb-4">
                Apakah Anda yakin ingin menghapus media <strong>"{deleteTarget.name}"</strong> dari Supabase Storage?
              </p>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md border border-[#EAECF0]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Tetap Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1F33]/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl border border-[#EAECF0]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAECF0]">
              <h4 className="font-bold text-sm text-[#0B1F33] truncate">{previewMedia.name}</h4>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="text-xs font-semibold text-[#667085] hover:text-[#0B1F33]"
              >
                Tutup
              </button>
            </div>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#EAECF0] mb-4 bg-[#F5F6F7]">
              <img
                src={previewMedia.publicUrl}
                alt={previewMedia.altText || previewMedia.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1.5 text-xs text-[#667085] font-mono">
              <p><strong>Slug:</strong> {previewMedia.slug}</p>
              <p><strong>Path Storage:</strong> {previewMedia.storagePath}</p>
              <p className="truncate"><strong>URL Publik:</strong> {previewMedia.publicUrl}</p>
              <p><strong>Alt Text:</strong> {previewMedia.altText || '—'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
