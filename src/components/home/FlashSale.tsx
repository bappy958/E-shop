import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCard } from '../common/ProductCard';
import { Product } from '../../types';
import { Sparkles, Timer, ArrowRight } from 'lucide-react';

interface FlashSaleProps {
  products: Product[];
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ products, onNavigate, onQuickView }) => {
  const { t } = useLanguage();

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashItems = products.filter((p) => p.isFlashSale);

  if (flashItems.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-black via-zinc-950 to-black text-white relative overflow-hidden">
      
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Timer */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-[#D4AF37]/40 rounded-3xl mb-10 shadow-2xl gap-6">
          
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
                LIMITED TIME DEALS
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {t('section.flashSale')}
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-[#D4AF37] hidden sm:block" />
            <div className="flex items-center gap-2 font-mono">
              <div className="px-3 py-2 bg-black border border-zinc-800 rounded-xl text-center min-w-[50px]">
                <span className="text-xl font-bold text-[#D4AF37]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-zinc-500 uppercase">Hours</span>
              </div>
              <span className="text-xl font-bold text-[#D4AF37]">:</span>
              <div className="px-3 py-2 bg-black border border-zinc-800 rounded-xl text-center min-w-[50px]">
                <span className="text-xl font-bold text-[#D4AF37]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-zinc-500 uppercase">Mins</span>
              </div>
              <span className="text-xl font-bold text-[#D4AF37]">:</span>
              <div className="px-3 py-2 bg-black border border-zinc-800 rounded-xl text-center min-w-[50px]">
                <span className="text-xl font-bold text-[#D4AF37]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="block text-[9px] text-zinc-500 uppercase">Secs</span>
              </div>
            </div>
          </div>

        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashItems.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onNavigate={onNavigate}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* View All Flash Sale */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('/shop?filter=sale')}
            className="px-8 py-3 bg-zinc-900 hover:bg-[#D4AF37] hover:text-black border border-zinc-700 hover:border-[#D4AF37] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all inline-flex items-center gap-2"
          >
            <span>সব অফার দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
