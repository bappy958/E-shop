import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  messageBn: string;
  messageEn: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  activeCoupon: Coupon | null;
  selectedDistrict: string;
  deliveryFee: number;
  toasts: ToastMessage[];
  
  addToCart: (product: Product, size?: string, color?: { nameBn: string; nameEn: string; hex: string }, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, colorHex: string) => void;
  updateQuantity: (productId: string, size: string, colorHex: string, delta: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  applyCoupon: (code: string) => { success: boolean; messageBn: string; messageEn: string };
  removeCoupon: () => void;
  
  setSelectedDistrict: (district: string) => void;
  addRecentlyViewed: (product: Product) => void;
  
  showToast: (messageBn: string, messageEn: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  cartCount: number;
  formatPrice: (amount: number, language?: 'bn' | 'en') => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('uc_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('uc_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    const saved = localStorage.getItem('uc_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('uc_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedDistrict, setSelectedDistrictState] = useState<string>('Dhaka');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    localStorage.setItem('uc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('uc_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('uc_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (activeCoupon) {
      localStorage.setItem('uc_coupon', JSON.stringify(activeCoupon));
    } else {
      localStorage.removeItem('uc_coupon');
    }
  }, [activeCoupon]);

  const showToast = (messageBn: string, messageEn: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, messageBn, messageEn }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: { nameBn: string; nameEn: string; hex: string },
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'Free Size';
    const chosenColor = color || product.colors[0] || { nameBn: 'ডিফল্ট', nameEn: 'Default', hex: '#000000' };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor.hex === chosenColor.hex
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });

    showToast(
      `"${product.titleBn}" শপিং ব্যাগে যোগ করা হয়েছে!`,
      `"${product.titleEn}" added to shopping bag!`
    );
  };

  const removeFromCart = (productId: string, size: string, colorHex: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          )
      )
    );
    showToast('পণ্যটি ব্যাগ থেকে সরিয়ে নেওয়া হয়েছে', 'Item removed from bag', 'info');
  };

  const updateQuantity = (productId: string, size: string, colorHex: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor.hex === colorHex
          ) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`"${product.titleBn}" পছন্দের তালিকা থেকে সরানো হয়েছে`, `Removed from wishlist`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`"${product.titleBn}" পছন্দের তালিকায় যোগ করা হয়েছে`, `Added to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code === trimmed && c.isActive);

    if (!found) {
      return {
        success: false,
        messageBn: 'অবৈধ কুপন কোড! অনুগ্রহ করে সঠিক কুপন দিন।',
        messageEn: 'Invalid coupon code! Please check and try again.',
      };
    }

    const currentSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (currentSubtotal < found.minOrderAmount) {
      return {
        success: false,
        messageBn: `এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${found.minOrderAmount} টাকার অর্ডার করতে হবে।`,
        messageEn: `Minimum order of ৳${found.minOrderAmount} required for this coupon.`,
      };
    }

    setActiveCoupon(found);
    showToast(`কুপন "${found.code}" সফলভাবে প্রয়োগ করা হয়েছে!`, `Coupon "${found.code}" applied successfully!`);

    return {
      success: true,
      messageBn: `অভিনন্দন! কুপন প্রয়োগ করা হয়েছে।`,
      messageEn: `Congratulations! Coupon applied.`,
    };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('কুপন তুলে নেওয়া হয়েছে', 'Coupon removed', 'info');
  };

  const setSelectedDistrict = (district: string) => {
    setSelectedDistrictState(district);
  };

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * activeCoupon.discountValue) / 100);
    } else {
      discountAmount = activeCoupon.discountValue;
    }
  }

  // Free shipping over ৳2,000 or else district fee
  const deliveryFee = subtotal >= 2000 || cart.length === 0 ? 0 : selectedDistrict === 'Dhaka' ? 70 : 130;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (amount: number, language: 'bn' | 'en' = 'bn'): string => {
    const formattedNum = amount.toLocaleString('en-US');
    if (language === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const bnStr = formattedNum.replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
      return `৳${bnStr}`;
    }
    return `৳${formattedNum}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        recentlyViewed,
        activeCoupon,
        selectedDistrict,
        deliveryFee,
        toasts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        setSelectedDistrict,
        addRecentlyViewed,
        showToast,
        removeToast,
        subtotal,
        discountAmount,
        totalAmount,
        cartCount,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
