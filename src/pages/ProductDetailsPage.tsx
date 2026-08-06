import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product, Review } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Share2,
  Ruler,
  Check,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onNavigate,
}) => {
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed, formatPrice, showToast } =
    useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');

  // AI Review Summary State
  const [aiSummary, setAiSummary] = useState<{ summaryBn?: string; summaryEn?: string } | null>(
    null
  );
  const [loadingAiSummary, setLoadingAiSummary] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setProduct(data);
          addRecentlyViewed(data);
        } else {
          const fallback = INITIAL_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
          if (fallback) {
            setProduct(fallback);
            addRecentlyViewed(fallback);
          }
        }
      })
      .catch(() => {
        const fallback = INITIAL_PRODUCTS.find((p) => p.id === productId || p.slug === productId);
        if (fallback) {
          setProduct(fallback);
          addRecentlyViewed(fallback);
        }
      });
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Free Size');
      setSelectedColor(product.colors[0] || null);

      // Fetch AI Review Summary
      if (product.reviews && product.reviews.length > 0) {
        setLoadingAiSummary(true);
        fetch('/api/ai/summarize-reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviews: product.reviews,
            productName: product.titleEn,
          }),
        })
          .then((res) => res.json())
          .then((data) => setAiSummary(data))
          .catch(() => {})
          .finally(() => setLoadingAiSummary(false));
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen py-20 text-center">
        <p className="text-zinc-400">পণ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  const title = language === 'bn' ? product.titleBn : product.titleEn;
  const description = language === 'bn' ? product.descriptionBn : product.descriptionEn;
  const fabric = language === 'bn' ? product.fabricBn : product.fabricEn;
  const care = language === 'bn' ? product.careInstructionsBn : product.careInstructionsEn;
  const isSaved = isInWishlist(product.id);

  const activeColor = selectedColor || product.colors[0];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, activeColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, activeColor, quantity);
    onNavigate('/checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: Review = {
      id: `r-${Date.now()}`,
      userId: 'usr-self',
      userName: reviewerName || 'গ্রাহক (Customer)',
      rating: reviewRating,
      commentBn: reviewComment,
      commentEn: reviewComment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            reviewsCount: prev.reviewsCount + 1,
            reviews: [newRev, ...(prev.reviews || [])],
          }
        : prev
    );

    showToast('আপনার রিভিউ সফলভাবে যুক্ত হয়েছে! ধন্যবাদ।', 'Review submitted! Thank you.');
    setReviewComment('');
    setReviewerName('');
  };

  const relatedProducts = INITIAL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-zinc-500 mb-8 flex items-center gap-2">
          <button onClick={() => onNavigate('/')} className="hover:text-white">হোম</button>
          <span>/</span>
          <button onClick={() => onNavigate('/shop')} className="hover:text-white">শপ</button>
          <span>/</span>
          <span className="text-[#D4AF37] line-clamp-1">{title}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
              <img
                src={product.images[selectedImg] || product.images[0]}
                alt={title}
                className="w-full h-full object-cover object-top"
              />

              {product.discountPercent && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#D4AF37] text-black font-extrabold text-xs rounded-md shadow-md">
                  -{product.discountPercent}% ছাড়
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isSaved ? 'bg-[#D4AF37] text-black' : 'bg-black/60 text-white hover:bg-[#D4AF37] hover:text-black'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-black' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === idx ? 'border-[#D4AF37] scale-105' : 'border-zinc-800 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="space-y-6">
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-xs font-bold uppercase bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-md">
                  {product.category.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-white text-sm">{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewsCount} টি রেটিং)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight mb-3">
                {title}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-3xl font-extrabold text-[#D4AF37]">
                  {formatPrice(product.price, language)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    {formatPrice(product.originalPrice, language)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {description}
            </p>

            {/* Size Picker */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  {t('product.size')}: <span className="text-[#D4AF37]">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>সাইজ গাইড</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 text-xs font-mono rounded-xl border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
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
                      className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
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

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-zinc-300 uppercase">পরিমাণ:</span>
              <div className="flex items-center border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                ({product.stockCount} টি স্টকে আছে)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 px-6 rounded-2xl bg-zinc-900 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('product.addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest transition-all shadow-xl"
              >
                {t('product.buyNow')}
              </button>
            </div>

            {/* Shipping & Assurance Banner */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 space-y-3 text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-semibold text-white">সারাদেশে হোম ডেলিভারি</p>
                  <p className="text-[11px] text-zinc-400">ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিন</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-zinc-900">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-semibold text-white">ক্যাশ অন ডেলিভারি ও ১০০% আসল কোয়ালিটি</p>
                  <p className="text-[11px] text-zinc-400">পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন</p>
                </div>
              </div>
            </div>

            {/* Fabric & Care Specs */}
            <div className="p-5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider">
                {t('product.fabric')} & Care Instructions
              </h4>
              <p className="text-zinc-300"><strong>ফ্যাব্রিক:</strong> {fabric}</p>
              <p className="text-zinc-400"><strong>ধোয়ার নিয়ম:</strong> {care}</p>
            </div>

          </div>

        </div>

        {/* AI Review Summary Section */}
        {aiSummary && (
          <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#D4AF37]/40 rounded-3xl mb-12 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                এআই রভিউ সামারি (AI Sentiment Analysis)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-light">
              {language === 'bn' ? aiSummary.summaryBn : aiSummary.summaryEn}
            </p>
          </div>
        )}

        {/* Reviews & Ratings Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-white mb-8 border-b border-zinc-800 pb-3">
            গ্রাহকদের রিভিউ ও রেটিং ({product.reviewsCount})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-4">
              {(!product.reviews || product.reviews.length === 0) ? (
                <p className="text-xs text-zinc-500 italic">এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি দিন!</p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="px-2 py-0.5 text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] rounded font-semibold">
                            ভেরিফাইড বাইয়ার
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-zinc-300 font-light">
                      {language === 'bn' ? rev.commentBn : rev.commentEn}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl h-fit">
              <h3 className="text-sm font-bold text-white mb-4">আপনার নিজস্ব মতামত লিখুন</h3>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="নাম লিখুন..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">রেটিং নির্বাচন করুন</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`p-1 transition-colors ${
                          star <= reviewRating ? 'text-amber-400' : 'text-zinc-700'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">আপনার মন্তব্য</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={3}
                    placeholder="পণ্যটি কেমন লেগেছে? কাপড়ের মান, ফিটিং ও ডেলিভারি সম্পর্কে লিখুন..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  রিভিউ জমা দিন
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Related Products Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-zinc-900">
            <h2 className="text-2xl font-serif font-bold text-white mb-8">
              একই ক্যাটাগরির অন্যান্য পণ্য (Related Products)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
