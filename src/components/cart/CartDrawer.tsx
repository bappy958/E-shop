import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { DISTRICTS_BANGLADESH } from '../../data/initialData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    selectedDistrict,
    setSelectedDistrict,
    formatPrice,
  } = useCart();

  const { language, t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(language === 'bn' ? res.messageBn : res.messageEn);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-black">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-bold tracking-wide">{t('cart.title')}</h2>
              <span className="text-xs bg-zinc-800 text-zinc-300 font-mono px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-zinc-400 font-medium mb-4">{t('cart.empty')}</p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#b8952d] transition-colors"
                >
                  কেনাকাটা করুন
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const itemTitle = language === 'bn' ? item.product.titleBn : item.product.titleEn;
                const colorName = language === 'bn' ? item.selectedColor.nameBn : item.selectedColor.nameEn;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}-${idx}`}
                    className="flex gap-4 p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl relative group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={itemTitle}
                      className="w-20 h-24 object-cover object-top rounded-lg bg-black shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-white line-clamp-2 pr-6">
                          {itemTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          <span>সাইজ: <strong className="text-zinc-200">{item.selectedSize}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            রং:
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block border border-zinc-700"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {colorName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden bg-black">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)}
                            className="p-1 hover:bg-zinc-800 text-zinc-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-[#D4AF37]">
                          {formatPrice(item.product.price * item.quantity, language)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.hex)}
                      className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="সরিয়ে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculations & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 bg-black border-t border-zinc-800 space-y-4">
              
              {/* District Shipping Selector */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>ডেলিভারি এলাকা নির্বাচন করুন:</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {DISTRICTS_BANGLADESH.map((d) => (
                    <option key={d.nameEn} value={d.nameEn}>
                      {language === 'bn' ? d.nameBn : d.nameEn} ({d.deliveryFee === 70 ? 'ঢাকা ৳৭০' : 'ঢাকার বাইরে ৳১৩০'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupon Form */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                      <Tag className="w-4 h-4" />
                      <span>কুপন কোড: {activeCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:underline text-[11px]"
                    >
                      সরান
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCouponSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="কুপন কোড (যেমন: UNIQUE10)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 uppercase focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                    >
                      প্রয়োগ
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
              </div>

              {/* Calculations */}
              <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-zinc-900">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-mono">{formatPrice(subtotal, language)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>{t('cart.discount')}</span>
                    <span className="font-mono">-{formatPrice(discountAmount, language)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="font-mono">
                    {deliveryFee === 0 ? 'ফ্রি' : formatPrice(deliveryFee, language)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#D4AF37] font-mono">{formatPrice(totalAmount, language)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={() => {
                  onClose();
                  onNavigate('/checkout');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{t('cart.checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
