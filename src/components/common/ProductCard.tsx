import React, { useState } from 'react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onQuickView }) => {
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist, formatPrice } = useCart();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const isSaved = isInWishlist(product.id);

  return (
    <div className="group relative bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-[#D4AF37]/60 transition-all duration-300 shadow-lg flex flex-col h-full">
      
      {/* Image Container */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 cursor-pointer"
        onClick={() => onNavigate(`/product/${product.id}`)}
        onMouseEnter={() => product.images.length > 1 && setCurrentImgIndex(1)}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img
          src={product.images[currentImgIndex] || product.images[0]}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase bg-[#D4AF37] text-black rounded-md shadow-md">
              -{product.discountPercent}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase bg-red-600 text-white rounded-md flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3" />
              {language === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale'}
            </span>
          )}
          {product.isNewArrival && !product.discountPercent && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase bg-white text-black rounded-md shadow-md">
              {language === 'bn' ? 'নতুন' : 'New'}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md z-10 ${
            isSaved
              ? 'bg-[#D4AF37] text-black shadow-[#D4AF37]/30'
              : 'bg-black/60 text-white hover:bg-[#D4AF37] hover:text-black'
          }`}
          title={t('wishlist.title')}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
        </button>

        {/* Quick View Floating Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-zinc-900/90 hover:bg-black text-white text-xs font-medium rounded-xl border border-zinc-700 hover:border-[#D4AF37] backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors shadow-xl"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('product.quickView')}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-gradient-to-b from-zinc-950 to-black">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 text-xs text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-200">{product.rating}</span>
            <span className="text-zinc-500 text-[11px]">({product.reviewsCount})</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onNavigate(`/product/${product.id}`)}
            className="text-sm font-medium text-zinc-100 hover:text-[#D4AF37] transition-colors line-clamp-2 cursor-pointer mb-2 leading-relaxed"
          >
            {title}
          </h3>

          {/* Sizes */}
          <div className="flex items-center gap-1 flex-wrap mb-3">
            {product.sizes.map((sz) => (
              <span
                key={sz}
                className="px-1.5 py-0.5 text-[10px] font-mono border border-zinc-800 text-zinc-400 rounded bg-zinc-900/50"
              >
                {sz}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-[#D4AF37]">
              {formatPrice(product.price, language)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(product.originalPrice, language)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              product.inStock
                ? 'bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10'
                : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inStock ? t('product.addToCart') : t('product.outOfStock')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
