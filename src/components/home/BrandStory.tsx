import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Award, HeartHandshake, Sparkles } from 'lucide-react';

export const BrandStory: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-20 bg-zinc-950 text-white relative overflow-hidden border-y border-zinc-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Side with Gold Border Frame */}
          <div className="relative">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
                alt="Brand Craftsmanship"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Tagline Card Floating */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-black/90 backdrop-blur-md p-6 rounded-2xl border border-[#D4AF37] max-w-xs shadow-2xl">
              <p className="text-[#D4AF37] font-serif text-lg font-bold italic mb-1">
                "আপনার স্টাইল, আমাদের দায়িত্ব।"
              </p>
              <p className="text-[11px] text-zinc-400 font-light">
                — ইউনিক কালেকশন ৪.০
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BRAND HERITAGE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {t('section.brandStory')}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              ইউনিক কালেকশন ৪.০ বাংলাদেশের একটি ঐতিহ্যবাহী অথচ আধুনিক ফ্যাশন হাউস। আমাদের প্রতিটি পাঞ্জাবি, অক্সফোর্ড শার্ট, প্রিমিয়াম দুবাই চেরি আবায়া এবং হিজাব শতভাগ গুণগত মান নিশ্চিত করে দক্ষ কারিগরদের নিখুঁত বুননে তৈরি।
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              আমরা বিশ্বাস করি পোশাক শুধু পরার জিনিস নয়, এটি আপনার ব্যক্তিত্ব ও রুচির বহিপ্রকাশ। তাই প্রতিটি ফেব্রিক সিলেকশন থেকে শুরু করে স্টিচিং ও ডেলিভারি পর্যন্ত আমরা প্রদান করি সর্বোচ্চ যত্ন ও সততা।
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF37] block">
                  ৫০,০০০+
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                  সন্তষ্ট গ্রাহক
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF37] block">
                  ৬৪
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                  জেলায় ডেলিভারি
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#D4AF37] block">
                  ১০০%
                </span>
                <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
                  আসল ফেব্রিক
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('/about')}
                className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl"
              >
                আমাদের সম্পর্কে আরও জানুন
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
