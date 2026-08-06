import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { wishlist } = useCart();

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 pb-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
              SAVED ITEMS
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
              <Heart className="w-8 h-8 text-[#D4AF37] fill-[#D4AF37]" />
              <span>{t('wishlist.title')}</span>
            </h1>
          </div>
          <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-300">
            {wishlist.length} টি পণ্য
          </span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-3xl border border-zinc-800 max-w-md mx-auto">
            <Heart className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t('wishlist.empty')}</h3>
            <p className="text-xs text-zinc-400 mb-6">
              পছন্দের পণ্যের পাশে থাকা হার্ট আইকনে ক্লিক করে উইশলিস্টে সংরক্ষণ করুন।
            </p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#b8952d]"
            >
              ক্যাটালগ দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
                onQuickView={() => {}}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
