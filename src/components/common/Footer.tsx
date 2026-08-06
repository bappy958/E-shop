import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  ExternalLink,
  User,
  Code,
  Crown,
  Heart,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import officialLogo from '../../assets/images/official_logo_1785981840591.jpg';

export const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { language } = useLanguage();

  return (
    <footer className="bg-black text-white border-t border-zinc-900 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle gold glow accent line at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 3 Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-12 border-b border-zinc-900">
          
          {/* COLUMN 1: Official Logo, Store Name, Tagline, Description & Social Icons */}
          <div className="space-y-6">
            <div
              onClick={() => onNavigate('/')}
              className="cursor-pointer group flex items-center gap-4"
            >
              {/* Official Uploaded Logo Image */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-b from-zinc-800 via-zinc-950 to-black border border-[#D4AF37]/40 shadow-xl group-hover:border-[#D4AF37] transition-all group-hover:scale-105 shrink-0 overflow-hidden">
                <img
                  src={officialLogo}
                  alt="Unique Collection 4.0 Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-serif font-extrabold text-xl sm:text-2xl tracking-wider text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                  UNIQUE <span className="gold-gradient-text">COLLECTION 4.0</span>
                </h3>
                <p className="text-xs text-[#D4AF37] font-serif italic mt-0.5">
                  "আপনার স্টাইল, আমাদের দায়িত্ব।"
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Unique Collection 4.0 is a Bangladeshi online fashion store offering premium shirts, t-shirts, panjabi, hijab, borka, and girls' collections with delivery all over Bangladesh.
            </p>

            {/* Social Icons */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-semibold tracking-wider block">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://web.facebook.com/profile.php?id=61592715308551"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-zinc-900 transition-all hover:-translate-y-1 group shadow-md"
                  title="Facebook Page"
                >
                  <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>

                <a
                  href="https://wa.me/8801716460606"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all hover:-translate-y-1 group shadow-md"
                  title="WhatsApp 01716460606"
                >
                  <MessageSquare className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>

                <a
                  href="mailto:amsamiul27@gmail.com"
                  className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-zinc-900 transition-all hover:-translate-y-1 group shadow-md"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Contact & Location */}
          <div className="space-y-6">
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-widest border-b border-zinc-800 pb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <span>Contact & Location</span>
            </h4>

            <ul className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 group-hover:border-[#D4AF37] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 font-mono uppercase block">WhatsApp</span>
                  <a
                    href="https://wa.me/8801716460606"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-white hover:text-[#D4AF37] transition-colors"
                  >
                    01716460606
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 group-hover:border-[#D4AF37] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 font-mono uppercase block">Email</span>
                  <a
                    href="mailto:amsamiul27@gmail.com"
                    className="font-mono font-semibold text-white hover:text-[#D4AF37] transition-colors"
                  >
                    amsamiul27@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 group-hover:border-[#D4AF37] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 font-mono uppercase block">Location</span>
                  <span className="text-zinc-200">Pirganj, Rangpur, Bangladesh</span>
                </div>
              </li>

              <li className="flex items-start gap-3 group pt-1">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5 group-hover:border-[#D4AF37] transition-colors">
                  <Facebook className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 font-mono uppercase block">Facebook Page</span>
                  <a
                    href="https://web.facebook.com/profile.php?id=61592715308551"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#D4AF37] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>Visit Our Facebook Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Shop Owner & Developer Details */}
          <div className="space-y-6">
            
            {/* Shop Owner */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#D4AF37] tracking-widest flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Shop Owner</span>
              </span>
              <div>
                <h5 className="text-base font-bold text-white font-serif">Am Samiul Islam Abir</h5>
                <p className="text-xs text-zinc-400">Founder &amp; Owner</p>
              </div>
            </div>

            {/* Developer Details */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900/60 border border-zinc-800/80 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-[#D4AF37] tracking-widest flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Developer</span>
              </span>
              <div>
                <h5 className="text-base font-bold text-white font-serif">Bappy Ahmed</h5>
                <p className="text-xs text-zinc-400 mb-1">Full Stack MERN Developer</p>
                <div className="text-xs text-zinc-300 font-mono flex items-center gap-1">
                  <span className="text-zinc-500">Email:</span>
                  <a
                    href="mailto:itznobita958@gmail.com"
                    className="text-[#D4AF37] hover:underline"
                  >
                    itznobita958@gmail.com
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-mono">
          <p className="text-center sm:text-left">
            © 2025 Unique Collection 4.0. All Rights Reserved.
          </p>

          <p className="text-center sm:text-right text-zinc-300 flex items-center gap-1">
            <span>Designed &amp; Developed by</span>
            <span className="font-bold text-white">Bappy Ahmed</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>

      </div>
    </footer>
  );
};

