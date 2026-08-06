import React, { useState } from 'react';
import { Award, Plus, Trash2, Edit, X } from 'lucide-react';
import { Brand } from '../../types';

interface AdminBrandsViewProps {
  brands: Brand[];
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshBrands: () => void;
}

export const AdminBrandsView: React.FC<AdminBrandsViewProps> = ({
  brands,
  showToast,
  onRefreshBrands,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setLogo('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: Brand) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug);
    setLogo(b.logo);
    setDescription(b.description || '');
    setIsModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo,
      description,
      status: 'active',
    };

    try {
      const url = editingBrand ? `/api/brands/${editingBrand.id}` : '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.brand || data.success) {
        showToast(
          editingBrand ? 'ব্র্যান্ড তথ্য আপডেট হয়েছে!' : 'নতুন ব্র্যান্ড তৈরি হয়েছে!',
          editingBrand ? 'Brand updated!' : 'New brand created!'
        );
        setIsModalOpen(false);
        onRefreshBrands();
      }
    } catch (err) {
      alert('ব্র্যান্ড সংরক্ষণ করা যায়নি।');
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই ব্র্যান্ডটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('ব্র্যান্ডটি মুছে ফেলা হয়েছে!', 'Brand deleted!');
        onRefreshBrands();
      }
    } catch (err) {
      alert('ব্র্যান্ড মোছা সম্ভব হয়নি।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-[#D4AF37]" size={22} />
            <span>ব্র্যান্ড সমূহের তালিকা (Brands Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">অফিসিয়াল পার্টনার ব্র্যান্ড ও নিজস্ব কালেকশন লেবেল</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10"
        >
          <Plus size={16} />
          <span>নতুন ব্র্যান্ড যোগ করুন (Add Brand)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {brands.map((b) => (
          <div
            key={b.id}
            className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all space-y-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={b.logo}
                alt={b.name}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 bg-black shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{b.name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono">/{b.slug}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2">{b.description || 'ইউনিক কালেকশন ৪.০ অনুমোদিত ব্র্যান্ড।'}</p>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(b)}
                className="p-1.5 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-300 rounded-lg text-xs"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDeleteBrand(b.id)}
                className="p-1.5 bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-300 rounded-lg text-xs"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-6 text-white space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">{editingBrand ? 'ব্র্যান্ড এডিট' : 'নতুন ব্র্যান্ড তৈরি'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">ব্র্যান্ড নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Unique Royal"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">লোগো / ছবি ইউআরএল</label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">বিবরণ (Description)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                <button type="submit" className="px-5 py-2 bg-[#D4AF37] text-black font-extrabold rounded-xl">
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
