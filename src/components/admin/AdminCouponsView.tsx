import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit, X, Check, Calendar, AlertCircle } from 'lucide-react';
import { Coupon } from '../../types';

interface AdminCouponsViewProps {
  coupons: Coupon[];
  formatPrice: (amount: number) => string;
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshCoupons: () => void;
}

export const AdminCouponsView: React.FC<AdminCouponsViewProps> = ({
  coupons,
  formatPrice,
  showToast,
  onRefreshCoupons,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1000);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [isActive, setIsActive] = useState(true);

  const handleOpenAddModal = () => {
    setEditingCoupon(null);
    setCode(`EID2026_${Math.floor(10 + Math.random() * 90)}`);
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(2000);
    setExpiresAt('2026-12-31');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderAmount(c.minOrderAmount);
    setExpiresAt(c.expiresAt);
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const payload = {
      code,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      expiresAt,
      isActive,
    };

    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon.id || editingCoupon.code}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.coupon || data.success) {
        showToast(
          editingCoupon ? 'কুপন আপডেট করা হয়েছে!' : 'নতুন কুপন তৈরি হয়েছে!',
          editingCoupon ? 'Coupon updated!' : 'New coupon created!'
        );
        setIsModalOpen(false);
        onRefreshCoupons();
      }
    } catch (err) {
      alert('কুপন সংরক্ষণ সম্ভব হয়নি।');
    }
  };

  const handleDeleteCoupon = async (couponCode: string) => {
    if (!window.confirm('আপনি কি এই কুপনটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/coupons/${couponCode}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('কুপন মুছে ফেলা হয়েছে!', 'Coupon deleted!');
        onRefreshCoupons();
      }
    } catch (err) {
      alert('কুপন মোছা যায়নি।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="text-[#D4AF37]" size={22} />
            <span>ডিসকাউন্ট কুপন (Coupon Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">গ্রাহকদের প্রমোশনাল ডিসকাউন্ট ও ভাউচার কোড</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10"
        >
          <Plus size={16} />
          <span>নতুন কুপন তৈরি করুন (Create Coupon)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c, i) => (
          <div
            key={i}
            className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-4 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono font-bold rounded-lg text-sm tracking-wider">
                  {c.code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Expired'}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-2xl font-bold text-white font-mono">
                  {c.discountType === 'percentage' ? `${c.discountValue}% ছাড়` : `৳${c.discountValue} ছাড়`}
                </p>
                <p className="text-xs text-zinc-400">
                  সর্বনিম্ন অর্ডার: <span className="font-mono text-zinc-200">{formatPrice(c.minOrderAmount)}</span>
                </p>
                <p className="text-xs text-zinc-500 font-mono">মেয়াদ শেষ: {c.expiresAt}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(c)}
                className="p-1.5 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-300 rounded-lg text-xs"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDeleteCoupon(c.code)}
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
              <h3 className="text-lg font-bold text-white">{editingCoupon ? 'কুপন এডিট' : 'নতুন কুপন কোড'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">কুপন কোড (Coupon Code) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="UNIQUE10"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">ডিসকাউন্ট টাইপ</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="percentage">পার্সেন্টেজ (%)</option>
                    <option value="fixed">ফিক্সড টাকা (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">ডিসকাউন্ট পরিমাণ</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl font-mono focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">সর্বনিম্ন অর্ডার মূল্য (BDT)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl font-mono focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">মেয়াদ শেষ তারিখ</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl focus:border-[#D4AF37] focus:outline-none font-mono"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-[#D4AF37]"
                />
                <span className="font-semibold text-zinc-300">সক্রিয় রয়েছে (Active)</span>
              </label>

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
