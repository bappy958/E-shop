import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialData';
import { SlidersHorizontal, X, Search, Check, Sparkles, Filter } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  searchParams?: URLSearchParams;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate, searchParams }) => {
  const { language, t } = useLanguage();
  const { formatPrice } = useCart();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams?.get('category') || ''
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams?.get('search') || ''
  );
  const [filterType, setFilterType] = useState<string>(
    searchParams?.get('filter') || ''
  );
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(filterType === 'sale');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');

  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams) {
      if (searchParams.get('category')) setSelectedCategory(searchParams.get('category') || '');
      if (searchParams.get('search')) setSearchQuery(searchParams.get('search') || '');
      if (searchParams.get('filter')) {
        const flt = searchParams.get('filter');
        if (flt === 'sale') setOnSaleOnly(true);
      }
    }
  }, [searchParams]);

  const allSizes = ['M', 'L', 'XL', 'XXL', '52', '54', '56', '58', 'Free Size'];

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setFilterType('');
    setMaxPrice(6000);
    setSelectedSizes([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('featured');
  };

  // Filtering Logic
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchBn = p.titleBn.toLowerCase().includes(q) || p.descriptionBn.toLowerCase().includes(q);
      const matchEn = p.titleEn.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchBn && !matchEn && !matchTag) return false;
    }

    if (p.price > maxPrice) return false;

    if (selectedSizes.length > 0) {
      const hasSize = p.sizes.some((s) => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    if (inStockOnly && !p.inStock) return false;
    if (onSaleOnly && !(p.discountPercent && p.discountPercent > 0)) return false;

    if (filterType === 'new' && !p.isNewArrival) return false;
    if (filterType === 'best' && !p.isBestSeller) return false;

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="bg-black text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Shop Header */}
        <div className="mb-8 pb-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
              UNIQUE COLLECTION 4.0
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              {t('nav.shop')}
            </h1>
          </div>

          {/* Active Search / Category Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-white flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>ফিল্টার</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline">সর্ট করুন:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">পছন্দসই (Featured)</option>
                <option value="price-low">মূল্য: কম থেকে বেশি</option>
                <option value="price-high">মূল্য: বেশি থেকে কম</option>
                <option value="rating">সেরা রেটিং</option>
                <option value="newest">নতুন কালেকশন</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-zinc-950 p-6 rounded-3xl border border-zinc-800/80 h-fit sticky top-24 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>ফিল্টার করুন</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-[11px] text-[#D4AF37] hover:underline font-medium"
              >
                রিসেট
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                ক্যাটাগরি
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === ''
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  সকল ক্যাটাগরি
                </button>
                {INITIAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                    <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-300 mb-2">
                <span>সর্বোচ্চ মূল্য:</span>
                <span className="text-[#D4AF37] font-mono font-bold">
                  {formatPrice(maxPrice, language)}
                </span>
              </div>
              <input
                type="range"
                min={500}
                max={6000}
                step={250}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
            </div>

            {/* Sizes */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                সাইজ নির্বাচন
              </h4>
              <div className="flex flex-wrap gap-2">
                {allSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
                <span>শুধু স্টকে থাকা পণ্য (In Stock)</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-xs text-zinc-300">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
                <span>শুধু অফার ও ডিসকাউন্ট (Sale)</span>
              </label>
            </div>

          </aside>

          {/* Product Listings Grid */}
          <main className="lg:col-span-3">
            
            {/* Active Filter Chips */}
            {(selectedCategory || searchQuery || selectedSizes.length > 0 || onSaleOnly) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs">
                <span className="text-zinc-500">সক্রিয় ফিল্টার:</span>
                {selectedCategory && (
                  <span className="px-2.5 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-lg font-medium flex items-center gap-1">
                    ক্যাটাগরি: {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('')} />
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-1 bg-zinc-800 text-white rounded-lg font-medium flex items-center gap-1">
                    খুঁজছেন: "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedSizes.map((sz) => (
                  <span key={sz} className="px-2.5 py-1 bg-zinc-800 text-white rounded-lg font-mono flex items-center gap-1">
                    সাইজ: {sz}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => toggleSize(sz)} />
                  </span>
                ))}
                <button onClick={clearFilters} className="text-red-400 hover:underline text-xs ml-auto">
                  সব মুছুন
                </button>
              </div>
            )}

            {/* Results Count */}
            <p className="text-xs text-zinc-400 mb-6 font-mono">
              মোট <strong className="text-white">{filteredProducts.length}</strong> টি পণ্য পাওয়া গেছে
            </p>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-zinc-950 rounded-3xl border border-zinc-800">
                <Filter className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">কোনো পণ্য পাওয়া যায়নি!</h3>
                <p className="text-xs text-zinc-400 mb-6">
                  আপনার নির্বাচিত ফিল্টার অনুযায়ী কোনো পণ্য নেই। অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন।
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#b8952d]"
                >
                  ফিল্টার রিসেট করুন
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onNavigate={onNavigate}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
