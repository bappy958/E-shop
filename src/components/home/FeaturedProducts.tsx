import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onNavigate, onQuickView }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'best' | 'panjabi' | 'borka'>('all');

  const tabs = [
    { id: 'all', labelBn: 'সবগুলো', labelEn: 'All Products' },
    { id: 'new', labelBn: 'নতুন কালেকশন', labelEn: 'New Arrivals' },
    { id: 'best', labelBn: 'বেস্ট সেলার', labelEn: 'Best Sellers' },
    { id: 'panjabi', labelBn: 'পাঞ্জাবি', labelEn: 'Panjabi' },
    { id: 'borka', labelBn: 'আবায়া ও বোরকা', labelEn: 'Abaya & Borka' },
  ];

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'new':
        return products.filter((p) => p.isNewArrival);
      case 'best':
        return products.filter((p) => p.isBestSeller);
      case 'panjabi':
        return products.filter((p) => p.category === 'panjabi');
      case 'borka':
        return products.filter((p) => p.category === 'womens-borka');
      default:
        return products;
    }
  };

  const displayedProducts = getFilteredProducts().slice(0, 8);

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
              EXCLUSIVE SELECTION
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight text-center md:text-left">
              {t('section.newArrivals')}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
            {tabs.map((tab) => {
              const label = language === 'bn' ? tab.labelBn : tab.labelEn;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold shadow-lg'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Shop CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/shop')}
            className="px-8 py-3.5 bg-gradient-to-r from-zinc-900 to-black hover:bg-[#D4AF37] hover:text-black border border-[#D4AF37] text-[#D4AF37] text-xs font-bold uppercase tracking-widest rounded-xl transition-all inline-flex items-center gap-2 shadow-xl"
          >
            <span>সম্পূর্ণ ক্যাটালগ দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
