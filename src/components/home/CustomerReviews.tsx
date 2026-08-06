import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { language, t } = useLanguage();

  const reviews = [
    {
      id: 'rev-1',
      name: 'তানভীর আহমেদ',
      role: 'ঢাকা',
      rating: 5,
      comment: 'রাজকীয় প্রিমিয়াম পাঞ্জাবিটার এম্ব্রয়ডারি এত সুন্দর যে ঈদে পরে সবাই প্রশংসা করেছে! কাপড়টা খুবই সফট এবং ঢাকার ভেতরে মাত্র ২৪ ঘণ্টার মধ্যে ডেলিভারি পেয়েছি।',
      date: '২৮ জুলাই, ২০২৬',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'rev-2',
      name: 'নাসরিন সুলতানা',
      role: 'চট্টগ্রাম',
      rating: 5,
      comment: 'দুবাই চেরি আবায়া সেটটা হাতে পাওয়ার পর মুগ্ধ হয়ে গিয়েছি। ফেব্রিকস ১০০% অরিজিনাল দুবাই চেরি এবং স্টিচিং অনেক নিখুঁত।',
      date: '২ আগস্ট, ২০২৬',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'rev-3',
      name: 'কামরুল হাসান',
      role: 'সিলেট',
      rating: 5,
      comment: 'অক্সফোর্ড কটন শার্টসগুলো অফিসে পরার জন্য সেরা! ধোয়ার পরও কলার বা কাপড় নষ্ট হয়নি। প্রিমিয়াম প্যাকেজিং পছন্দ হয়েছে।',
      date: '৫ আগস্ট, ২০২৬',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <section className="py-20 bg-black text-white border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-2">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {t('section.customerReviews')}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-light">
            আমাদের সম্মানিত গ্রাহকদের বিশ্বাস ও ভালোবাসার কিছু অভিজ্ঞতা
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 hover:border-[#D4AF37]/50 transition-all shadow-xl flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-zinc-800 group-hover:text-[#D4AF37]/20 transition-colors pointer-events-none" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-900">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </h4>
                  <p className="text-[11px] text-zinc-500">{rev.role} • {rev.date}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
