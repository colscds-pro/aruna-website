import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, CheckCircle2 } from 'lucide-react';
import { Category } from '../../types';
import { CategoriesService } from '../../services/supabase/categoriesService';

export const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const list = await CategoriesService.getCategories(false);
      setCategories(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      if (isNew) {
        await CategoriesService.createCategory({
          name: editingCategory.name.toUpperCase().trim(),
          slug: editingCategory.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: editingCategory.description,
          active: editingCategory.active ?? true,
        });
        setNotification({ type: 'success', message: 'Kategori baru berhasil ditambahkan.' });
      } else {
        await CategoriesService.updateCategory(editingCategory.id, editingCategory);
        setNotification({ type: 'success', message: 'Kategori berhasil diperbarui.' });
      }
      setEditingCategory(null);
      setIsNew(false);
      await loadCategories();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal menyimpan.' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await CategoriesService.deleteCategory(id);
      setNotification({ type: 'success', message: 'Kategori berhasil dihapus.' });
      await loadCategories();
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Gagal menghapus.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F33]">
            Manajemen Kategori
          </h2>
          <p className="text-xs text-[#667085] mt-0.5">
            Kelola kategori pemikiran untuk mengelompokkan artikel di ARUNA Insights.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsNew(true);
            setEditingCategory({
              id: '',
              name: '',
              slug: '',
              description: '',
              active: true,
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B1F33] hover:bg-[#132D47] text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#B59A5A]" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
          {notification.message}
        </div>
      )}

      {/* Editor Modal / Card */}
      {editingCategory && (
        <div className="bg-white p-6 rounded-xl border border-[#EAECF0] shadow-sm max-w-lg">
          <h3 className="text-sm font-bold text-[#0B1F33] uppercase font-mono mb-4">
            {isNew ? 'Tambah Kategori Baru' : `Edit Kategori: ${editingCategory.name}`}
          </h3>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Nama Kategori</label>
              <input
                type="text"
                required
                value={editingCategory.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingCategory({
                    ...editingCategory,
                    name: val,
                    slug: isNew ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-') : editingCategory.slug,
                  });
                }}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7] font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Slug URL</label>
              <input
                type="text"
                required
                value={editingCategory.slug}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7] font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0B1F33] mb-1 font-mono uppercase">Deskripsi</label>
              <textarea
                rows={2}
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-[#EAECF0] rounded-md bg-[#F5F6F7]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAECF0]">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 border border-[#EAECF0] rounded-md font-semibold text-[#667085]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0B1F33] text-white rounded-md font-semibold hover:bg-[#132D47]"
              >
                Simpan Kategori
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-[#EAECF0] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F5F6F7] border-b border-[#EAECF0] font-mono text-[10px] font-bold text-[#667085] uppercase">
              <th className="py-3 px-4">Nama Kategori</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Deskripsi</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#F5F6F7]/50">
                <td className="py-3.5 px-4 font-bold text-[#0B1F33]">{cat.name}</td>
                <td className="py-3.5 px-4 font-mono text-[#667085]">{cat.slug}</td>
                <td className="py-3.5 px-4 text-[#667085]">{cat.description || '—'}</td>
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNew(false);
                      setEditingCategory(cat);
                    }}
                    className="p-1.5 text-[#0B1F33] hover:text-[#B59A5A]"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
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
