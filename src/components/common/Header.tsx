import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, Sparkles, Globe, ChevronDown, Tag, ShieldCheck } from 'lucide-react';
import officialLogo from '../../assets/images/official_logo_1785981840591.jpg';

interface HeaderProps {
  onOpenCart: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onNavigate, currentPath }) => {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount, wishlist, formatPrice } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.shop'), path: '/shop' },
    { name: t('nav.newArrivals'), path: '/shop?filter=new' },
    { name: t('nav.bestSellers'), path: '/shop?filter=best' },
    { name: t('nav.offers'), path: '/shop?filter=sale' },
    { name: t('nav.trackOrder'), path: '/track-order' },
    { name: t('nav.about'), path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black text-white border-b border-zinc-800 shadow-xl">
      {/* Top Bar Announcement */}
      <div className="bg-gradient-to-r from-zinc-950 via-[#111111] to-zinc-950 border-b border-[#D4AF37]/30 text-xs py-2 px-4 text-center text-[#D4AF37] font-medium tracking-wide flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>১০০% আসল কোয়ালিটি নিশ্চিতকোরি</span>
        </div>

        <p className="mx-auto text-center font-medium">
          {t('free.shipping.bar')}
        </p>

        {/* Language & Currency Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 hover:text-white transition-colors text-[11px]"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-[#D4AF37]" />
            <span className="font-semibold uppercase">{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-300 font-mono text-[11px]">৳ BDT</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => onNavigate('/')}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-[#D4AF37]/50 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all overflow-hidden p-0.5">
              <img
                src={officialLogo}
                alt="Unique Collection 4.0 Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-wider uppercase font-serif text-white group-hover:text-[#D4AF37] transition-colors leading-tight">
                UNIQUE <span className="text-[#D4AF37]">COLLECTION 4.0</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-light tracking-widest uppercase font-serif">
                {language === 'bn' ? 'আপনার স্টাইল, আমাদের দায়িত্ব।' : 'Your Style, Our Responsibility'}
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Wishlist */}
            <button
              onClick={() => onNavigate('/wishlist')}
              className="relative p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors"
              title={t('wishlist.title')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group"
              title={t('cart.title')}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

            {/* User Account Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-2 text-zinc-300 hover:text-[#D4AF37] transition-colors rounded-full border border-zinc-800 hover:border-[#D4AF37]"
              >
                <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                <span className="hidden lg:inline text-xs font-medium max-w-[100px] truncate">
                  {user ? user.name : t('account.title')}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 text-sm"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-zinc-800">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded font-semibold">
                            Admin Role
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onNavigate('/dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-[#D4AF37]" />
                        {t('account.dashboard')}
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            onNavigate('/admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[#D4AF37] hover:bg-zinc-800 transition-colors flex items-center gap-2 font-medium"
                        >
                          <Sparkles className="w-4 h-4" />
                          {t('account.admin')}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          onNavigate('/');
                        }}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-zinc-800 transition-colors border-t border-zinc-800 mt-1"
                      >
                        {t('account.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onNavigate('/login');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-white hover:bg-zinc-800 transition-colors font-medium flex items-center justify-between"
                      >
                        <span>{t('account.login')}</span>
                        <ChevronDown className="w-4 h-4 -rotate-90 text-[#D4AF37]" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-3 md:hidden relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#D4AF37]"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Navigation Links Bar - Desktop */}
      <nav className="hidden lg:block bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 py-2.5 text-xs font-medium uppercase tracking-widest text-zinc-300">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`hover:text-[#D4AF37] transition-colors relative py-1 ${
                    isActive ? 'text-[#D4AF37] font-semibold' : ''
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                onNavigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 px-3 rounded-lg text-sm text-zinc-200 hover:bg-zinc-900 hover:text-[#D4AF37] transition-colors border-b border-zinc-900"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
