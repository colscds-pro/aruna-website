import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, User, Upload, ArrowLeft } from 'lucide-react';
import { Author } from '../../types';
import { AuthorsService } from '../../services/supabase/authorsService';
import { MediaService } from '../../services/supabase/mediaService';

export const AuthorsManager: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadAuthors = async () => {
    setIsLoading(true);
    try {
      const list = await AuthorsService.getAuthors(false);
      setAuthors(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    try {
      if (isNew) {
        await AuthorsService.createAuthor({
          name: editingAuthor.name,
          slug: editingAuthor.slug || editingAuthor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          role: editingAuthor.role || 'Author',
          bio: editingAuthor.bio,
          photoUrl: editingAuthor.photoUrl,
          avatarUrl: editingAuthor.avatarUrl || editingAuthor.photoUrl,
          active: editingAuthor.active ?? true,
        });
        setNotification({ type: 'success', message: 'Penulis baru berhasil ditambahkan.' });
      } else {
        await AuthorsService.updateAuthor(editingAuthor.id, editingAuthor);
        setNotification({ type: 'success', message: 'Data penulis berhasil diperbarui.' });
      }
      setEditingAuthor(null);
      setIsNew(false);
      await loadAuthors();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal menyimpan.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus penulis "${name}"?`)) return;
    try {
      await AuthorsService.deleteAuthor(id);
      setNotification({ type: 'success', message: 'Penulis berhasil dihapus.' });
      await loadAuthors();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal menghapus.' });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAuthor) return;

    setIsUploading(true);
    try {
      const { publicUrl, error } = await MediaService.uploadMedia(file, 'authors', {
        name: `Avatar: ${editingAuthor.name || file.name}`,
        section: 'about',
      });
      if (error) {
        setNotification({ type: 'error', message: error.message });
      } else if (publicUrl) {
        setEditingAuthor({
          ...editingAuthor,
          photoUrl: publicUrl,
          avatarUrl: publicUrl,
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
            Manajemen Penulis (Authors)
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Kelola profil penulis dan penanggung jawab pemikiran di ARUNA Insights.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsNew(true);
            setEditingAuthor({
              id: '',
              name: '',
              slug: '',
              role: 'Author, ARUNA',
              bio: '',
              photoUrl: '/src/assets/images/author_nurcholish_1790919189982.jpg',
              active: true,
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132D47] text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B59A5A]" />
          <span>Tambah Penulis Baru</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          {notification.message}
        </div>
      )}

      {/* Editor Modal / Card */}
      {editingAuthor && (
        <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-[#0B1F33] uppercase font-mono mb-4">
            {isNew ? 'Tambah Penulis Baru' : `Edit Penulis: ${editingAuthor.name}`}
          </h3>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editingAuthor.name}
                onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Peran / Jabatan</label>
              <input
                type="text"
                required
                value={editingAuthor.role}
                onChange={(e) => setEditingAuthor({ ...editingAuthor, role: e.target.value })}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Biografi Singkat</label>
              <textarea
                rows={3}
                required
                value={editingAuthor.bio}
                onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7] leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Foto Profil</label>
              <div className="flex items-center gap-4">
                <img
                  src={editingAuthor.photoUrl}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover border border-[#EAECF0]"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F6F7] hover:bg-white border border-[#EAECF0] rounded text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#B59A5A]" />
                  <span>{isUploading ? 'Mengunggah...' : 'Ganti Foto'}</span>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAECF0]">
              <button
                type="button"
                onClick={() => setEditingAuthor(null)}
                className="px-4 py-2 border border-[#EAECF0] rounded-md font-semibold text-[#667085]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B1F33] text-white rounded-md font-semibold hover:bg-[#132D47]"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Authors List Table */}
      <div className="bg-white rounded-xl border border-[#EAECF0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F5F6F7] border-b border-[#EAECF0] font-mono text-[10px] font-bold text-[#667085] uppercase">
              <th className="py-3 px-4">Penulis</th>
              <th className="py-3 px-4">Peran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {authors.map((auth) => (
              <tr key={auth.id} className="hover:bg-[#F5F6F7]/50">
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <img
                    src={auth.photoUrl}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border border-[#EAECF0]"
                  />
                  <div>
                    <span className="font-bold text-[#0B1F33] block">{auth.name}</span>
                    <span className="text-[11px] text-[#667085] line-clamp-1 max-w-sm">{auth.bio}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-[#0B1F33]">{auth.role}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                    Aktif
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNew(false);
                      setEditingAuthor(auth);
                    }}
                    className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(auth.id, auth.name)}
                    className="p-1.5 text-[#667085] hover:text-rose-600 ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
