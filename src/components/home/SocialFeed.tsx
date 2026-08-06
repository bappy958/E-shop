import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Instagram, Facebook, Send, Check } from 'lucide-react';

export const SocialFeed: React.FC = () => {
  const { language, t } = useLanguage();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      showToast(
        'ধন্যবাদ! আপনার ইমেইল সফলভাবে নিবন্ধিত হয়েছে।',
        'Thank you! You have subscribed successfully.'
      );
      setEmail('');
    }
  };

  const socialImages = [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section className="py-20 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Social Feed Gallery */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-widest block mb-1">
            INSTAGRAM & FACEBOOK
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
            #UniqueCollection4.0 Lookbook
          </h2>
          <p className="text-xs text-zinc-400 font-light">
            ট্যাগ করুন আমাদের সোশ্যাল মিডিয়ায় এবং শেয়ার করুন আপনার ইউনিক লুক
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
          {socialImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-black border border-zinc-800 cursor-pointer"
            >
              <img
                src={img}
                alt="Lookbook"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Instagram className="w-5 h-5 text-[#D4AF37]" />
                <Facebook className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-[#D4AF37]/40 shadow-2xl max-w-4xl mx-auto text-center relative overflow-hidden">
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {t('section.newsletterTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
              {t('section.newsletterDesc')}
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="আপনার ইমেইল অ্যাড্রেস লিখুন..."
                className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>নিবন্ধিত</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('section.subscribeBtn')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
