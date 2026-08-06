import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_BANNERS } from '../../data/initialData';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const HeroBanner: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % INITIAL_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const banner = INITIAL_BANNERS[currentSlide] || INITIAL_BANNERS[0];
  const title = language === 'bn' ? banner.titleBn : banner.titleEn;
  const subtitle = language === 'bn' ? banner.subtitleBn : banner.subtitleEn;
  const ctaText = language === 'bn' ? banner.ctaTextBn : banner.ctaTextEn;
  const badge = language === 'bn' ? banner.badgeBn : banner.badgeEn;

  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Background Image Container */}
      <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[680px] w-full flex items-center">
        
        <img
          src={banner.image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.45] transition-all duration-1000 scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

        {/* Banner Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl">
            
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-300 font-light mb-8 leading-relaxed max-w-xl">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate(banner.link)}
                className="px-8 py-4 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-2xl shadow-[#D4AF37]/20 flex items-center gap-3 group"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/shop?category=panjabi')}
                className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl border border-zinc-700 hover:border-[#D4AF37] backdrop-blur-md transition-all"
              >
                {language === 'bn' ? 'পাঞ্জাবি কালেকশন' : 'Panjabi Drop'}
              </button>
            </div>

          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + INITIAL_BANNERS.length) % INITIAL_BANNERS.length)
            }
            className="p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black border border-zinc-700 text-white transition-colors backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-[#D4AF37]">
            0{currentSlide + 1} / 0{INITIAL_BANNERS.length}
          </span>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % INITIAL_BANNERS.length)}
            className="p-3 rounded-full bg-black/60 hover:bg-[#D4AF37] hover:text-black border border-zinc-700 text-white transition-colors backdrop-blur-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Brand Features Strip */}
      <div className="bg-zinc-950 border-y border-zinc-800/80 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? 'সারাদেশে ডেলিভারি' : 'Nationwide Shipping'}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {language === 'bn' ? '৬৪ জেলায় হোম ডেলিভারি' : 'Delivery to all 64 districts'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {language === 'bn' ? 'পণ্য দেখে মূল্য পরিশোধ' : 'Pay after receiving order'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? '৭ দিনের ইজি রিটার্ন' : '7 Days Easy Return'}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {language === 'bn' ? 'সাইজ পরিবর্তনের সুযোগ' : 'Hassle-free size replacement'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'bn' ? 'প্রিমিয়াম কোয়ালিটি' : 'Premium Quality'}
              </h4>
              <p className="text-[11px] text-zinc-400">
                {language === 'bn' ? '১০০% অরিজিনাল ফেব্রিক' : '100% Authentic Material'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
