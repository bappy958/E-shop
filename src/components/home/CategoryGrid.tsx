import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { ArrowUpRight } from 'lucide-react';

export const CategoryGrid: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-zinc-800">
          <div>
            <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
              CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {t('section.featuredCategories')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="mt-3 md:mt-0 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-wider flex items-center gap-1"
          >
            <span>সকল ক্যাটাগরি দেখুন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INITIAL_CATEGORIES.map((cat) => {
            const name = language === 'bn' ? cat.nameBn : cat.nameEn;
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
                className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer border border-zinc-800 hover:border-[#D4AF37] transition-all duration-500 shadow-xl"
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-[0.7] group-hover:brightness-[0.85]"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                  <div className="flex justify-end">
                    <span className="w-7 h-7 rounded-full bg-black/60 border border-zinc-700 text-white flex items-center justify-center text-xs group-hover:bg-[#D4AF37] group-hover:text-black group-hover:border-[#D4AF37] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                      {cat.itemCount}+ আইটেম
                    </span>
                    <h3 className="text-base font-bold text-white font-serif group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {name}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
