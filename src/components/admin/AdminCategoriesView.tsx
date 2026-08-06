import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit, Check, X, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoriesViewProps {
  categories: Category[];
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshCategories: () => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  categories,
  showToast,
  onRefreshCategories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [image, setImage] = useState('');

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setNameBn('');
    setNameEn('');
    setSlug('');
    setDescriptionBn('');
    setDescriptionEn('');
    setImage('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setNameBn(cat.nameBn);
    setNameEn(cat.nameEn);
    setSlug(cat.slug);
    setDescriptionBn(cat.descriptionBn || '');
    setDescriptionEn(cat.descriptionEn || '');
    setImage(cat.image || '');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn) return;

    const payload = {
      nameBn: nameBn || nameEn,
      nameEn,
      slug: slug || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      descriptionBn,
      descriptionEn,
      image,
      itemCount: editingCategory ? editingCategory.itemCount : 0,
      status: 'active',
    };

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.category || data.success) {
        showToast(
          editingCategory ? 'ক্যাটাগরি আপডেট করা হয়েছে!' : 'নতুন ক্যাটাগরি তৈরি হয়েছে!',
          editingCategory ? 'Category updated!' : 'New category created!'
        );
        setIsModalOpen(false);
        onRefreshCategories();
      }
    } catch (err) {
      alert('ক্যাটাগরি সংরক্ষণ করা সম্ভব হয়নি।');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('ক্যাটাগরি মুছে ফেলা হয়েছে!', 'Category deleted!');
        onRefreshCategories();
      }
    } catch (err) {
      alert('ক্যাটাগরি মুছে ফেলা যায়নি।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="text-[#D4AF37]" size={22} />
            <span>ক্যাটাগরি ব্যবস্থাপনা (Categories Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">মোট {categories.length} টি শপিং ক্যাটাগরি কনফিগার করা আছে</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10"
        >
          <Plus size={16} />
          <span>নতুন ক্যাটাগরি যোগ করুন (Add Category)</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-[#D4AF37]/50 transition-all flex flex-col"
          >
            {cat.image && (
              <div className="h-36 overflow-hidden relative bg-black">
                <img
                  src={cat.image}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-2 right-2 bg-black/80 text-[#D4AF37] font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  {cat.itemCount} টি পণ্য
                </span>
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-bold text-white">{cat.nameBn}</h3>
                <p className="text-xs text-zinc-400 font-mono">{cat.nameEn}</p>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{cat.descriptionBn || cat.descriptionEn}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-mono">slug: /{cat.slug}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-1.5 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-300 rounded-lg transition-colors text-xs"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-300 rounded-lg transition-colors text-xs"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 text-white space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">ক্যাটাগরি নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম পাঞ্জাবি"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Men's Panjabi"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">ইউআরএল স্ল্যাগ (Slug)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="panjabi"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">ব্যানার / ক্যাটাগরি ছবির ইউআরএল</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-black font-extrabold rounded-xl"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
