import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { X, Star, ShoppingBag, ShieldCheck, Heart, Truck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onNavigate }) => {
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useCart();

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const fabric = language === 'bn' ? product.fabricBn : product.fabricEn;
  const activeSize = selectedSize || product.sizes[0] || 'Free Size';
  const activeColor = selectedColor || product.colors[0];
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, activeSize, activeColor, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, activeSize, activeColor, quantity);
    onClose();
    onNavigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 hover:text-white bg-black/50 hover:bg-black rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="w-full md:w-1/2 bg-zinc-900 p-6 flex flex-col justify-between">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black mb-4 border border-zinc-800">
            <img
              src={product.images[selectedImg] || product.images[0]}
              alt={title}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx ? 'border-[#D4AF37]' : 'border-zinc-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded">
                {product.category.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-semibold text-white">{product.rating}</span>
                <span className="text-zinc-500">({product.reviewsCount})</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 leading-snug">{title}</h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#D4AF37]">
                {formatPrice(product.price, language)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(product.originalPrice, language)}
                </span>
              )}
            </div>

            <p className="text-xs text-zinc-400 mb-6 leading-relaxed line-clamp-3">
              {description}
            </p>

            {/* Size Selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                {t('product.size')}: <span className="text-[#D4AF37]">{activeSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      activeSize === size
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  {t('product.color')}:{' '}
                  <span className="text-[#D4AF37]">
                    {language === 'bn' ? activeColor?.nameBn : activeColor?.nameEn}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => setSelectedColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                        activeColor?.hex === col.hex ? 'border-[#D4AF37] scale-110' : 'border-zinc-800'
                      }`}
                      title={language === 'bn' ? col.nameBn : col.nameEn}
                    >
                      <span
                        className="block w-full h-full rounded-full"
                        style={{ backgroundColor: col.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fabric Highlight */}
            <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 text-xs text-zinc-300 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                <strong>{t('product.fabric')}:</strong> {fabric}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-zinc-900 to-black border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('product.addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
              >
                {t('product.buyNow')}
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigate(`/product/${product.id}`);
              }}
              className="w-full text-center text-xs text-zinc-400 hover:text-white underline pt-1"
            >
              সম্পূর্ণ বিবরণ ও রিভিউ দেখুন &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
