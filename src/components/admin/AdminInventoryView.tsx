import React from 'react';
import { AlertTriangle, Package, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface AdminInventoryViewProps {
  products: Product[];
  formatPrice: (amount: number) => string;
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshProducts: () => void;
}

export const AdminInventoryView: React.FC<AdminInventoryViewProps> = ({
  products,
  formatPrice,
  showToast,
  onRefreshProducts,
}) => {
  const lowStockItems = products.filter((p) => p.stockCount <= (p.lowStockThreshold || 10));

  const handleUpdateStock = async (productId: string, newCount: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockCount: newCount,
          inStock: newCount > 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('স্টক পরিমাণ আপডেট হয়েছে!', 'Stock count updated!');
        onRefreshProducts();
      }
    } catch (err) {
      alert('স্টক আপডেট করা যায়নি।');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-amber-400" size={22} />
            <span>ইনভেন্টরি & স্টক অ্যালার্ট (Inventory & Stock Alerts)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">লো স্টক ও আউট অফ স্টক পণ্যসমূহ দ্রুত রি-স্টক করুন</p>
        </div>

        <button
          onClick={onRefreshProducts}
          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw size={14} />
          <span>রিফ্রেশ (Refresh)</span>
        </button>
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">পণ্য (Product)</th>
                <th className="py-3.5 px-4">ক্যাটাগরি</th>
                <th className="py-3.5 px-4 font-mono">মূল্য</th>
                <th className="py-3.5 px-4 text-center">বর্তমান স্টক</th>
                <th className="py-3.5 px-4 text-center">স্টক আপডেট একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500">
                    <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400 opacity-80" />
                    <p className="text-sm font-semibold text-white">সব পণ্যের পর্যাপ্ত স্টক আছে!</p>
                  </td>
                </tr>
              ) : (
                lowStockItems.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={prod.thumbnail || prod.images[0]} alt={prod.titleEn} className="w-10 h-10 rounded object-cover border border-zinc-800" />
                      <div>
                        <p className="font-bold text-white">{prod.titleBn || prod.titleEn}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">SKU: {prod.sku || prod.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-zinc-400">{prod.category}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">{formatPrice(prod.price)}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded text-xs ${
                          prod.stockCount <= 0 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {prod.stockCount <= 0 ? 'OUT OF STOCK' : `${prod.stockCount} টি বাকি`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateStock(prod.id, Math.max(0, prod.stockCount - 1))}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => handleUpdateStock(prod.id, prod.stockCount + 10)}
                          className="px-3 py-1 bg-[#D4AF37] text-black hover:bg-[#b8952d] font-extrabold rounded"
                        >
                          +10 রি-স্টক
                        </button>
                        <button
                          onClick={() => handleUpdateStock(prod.id, prod.stockCount + 50)}
                          className="px-3 py-1 bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold rounded"
                        >
                          +50
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
  );
};
