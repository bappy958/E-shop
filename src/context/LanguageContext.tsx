import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Header & Nav
    'store.name': 'ইউনিক কালেকশন ৪.০',
    'store.tagline': 'আপনার স্টাইল, আমাদের দায়িত্ব।',
    'nav.home': 'হোম',
    'nav.shop': 'শপ',
    'nav.categories': 'ক্যাটাগরি',
    'nav.newArrivals': 'নতুন কালেকশন',
    'nav.bestSellers': 'বেস্ট সেলার',
    'nav.offers': 'অফার ও ডিসকাউন্ট',
    'nav.trackOrder': 'অর্ডার ট্র্যাকিং',
    'nav.about': 'আমাদের কথা',
    'nav.contact': 'যোগাযোগ',
    'search.placeholder': 'পাঞ্জাবি, শার্ট, বোরকা বা হিজাব খুঁজুন...',
    'free.shipping.bar': '🎉 সারাদেশে ক্যাশ অন ডেলিভারি সার্ভিস উপলব্ধ! ৳২,০০০+ অর্ডারে ফ্রি ডেলিভারি!',
    'cart.title': 'আপনার শপিং ব্যাগ',
    'wishlist.title': 'পছন্দের তালিকা',
    'account.title': 'আমার অ্যাকাউন্ট',
    'account.login': 'লগইন / রেজিস্ট্রেশন',
    'account.dashboard': 'ইউজার ড্যাশবোর্ড',
    'account.admin': 'এডমিন ড্যাশবোর্ড',
    'account.logout': 'লগআউট',

    // Product & Buttons
    'product.addToCart': 'কার্টে যোগ করুন',
    'product.buyNow': 'সরাসরি অর্ডার করুন',
    'product.quickView': 'কুইক ভিউ',
    'product.size': 'সাইজ বেছে নিন',
    'product.color': 'রং নির্বাচন',
    'product.inStock': 'স্টকে আছে',
    'product.outOfStock': 'স্টক শেষ',
    'product.stockLeft': 'টি অবশিষ্ট আছে',
    'product.reviews': 'টি রিভিউ',
    'product.fabric': 'ফ্যাব্রিক ও মেটেরিয়াল',
    'product.care': 'যত্ন ও ধোয়ার নিয়ম',
    'product.deliveryInfo': 'ডেলিভারি তথ্য',
    'product.deliveryInfoDhaka': 'ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি (৳৭০)',
    'product.deliveryInfoOutside': 'ঢাকার বাইরে ২-৩ কার্যদিবসের মধ্যে ডেলিভারি (৳১৩০)',
    'product.codAvailable': 'সারাদেশে ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)',

    // Sections
    'section.featuredCategories': 'জনপ্রিয় ক্যাটাগরি',
    'section.flashSale': 'ফ্ল্যাশ সেল - সীমিত সময়ের ধামাকা অফার',
    'section.newArrivals': 'নতুন ট্রেন্ডি কালেকশন',
    'section.bestSellers': 'গ্রাহকদের পছন্দের শীর্ষে',
    'section.brandStory': 'ইউনিক কালেকশন ৪.০ এর গল্প',
    'section.customerReviews': 'গ্রাহকদের মতামত ও মূল্যায়ন',
    'section.aiAssistant': 'এআই ফ্যাশন স্টাইলিস্ট',
    'section.aiAssistantDesc': 'আপনার উচ্চতা, অনুষ্ঠান ও পছন্দের ভিত্তিতে পারফেক্ট আউটফিট নির্বাচন করতে এআই সাহায্য নিন!',
    'section.newsletterTitle': 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন',
    'section.newsletterDesc': 'নতুন অফার, প্রিমিয়াম কালেকশন ড্রপ এবং বিশেষ কুপন পেতে আপনার ইমেইল দিন।',
    'section.subscribeBtn': 'সাবস্ক্রাইব',

    // Cart & Checkout
    'cart.empty': 'আপনার শপিং ব্যাগ খালি!',
    'cart.subtotal': 'সাবটোটাল',
    'cart.discount': 'ডিসকাউন্ট কুপন',
    'cart.shipping': 'ডেলিভারি চার্জ',
    'cart.total': 'সর্বমোট টাকা',
    'cart.checkout': 'অর্ডার সম্পন্ন করতে এগিয়ে যান',
    'cart.applyCoupon': 'কুপন কোড প্রয়োগ করুন',
    'cart.enterCoupon': 'কুপন টাইপ করুন...',
    'checkout.title': 'অর্ডার ইনফরমেশন ও ডেলিভারি ঠিকানা',
    'checkout.fullName': 'আপনার পুরো নাম',
    'checkout.phone': 'মোবাইল নম্বর (১১ ডিজিট)',
    'checkout.email': 'ইমেইল ঠিকানা',
    'checkout.division': 'বিভাগ নির্বাচন করুন',
    'checkout.district': 'জেলা নির্বাচন করুন',
    'checkout.thana': 'থানা/উপজেলা',
    'checkout.address': 'পূর্ণাঙ্গ ঠিকানা (বাসা নং, রোড, এরিয়া)',
    'checkout.paymentMethod': 'মূল্য পরিশোধের মাধ্যম',
    'checkout.cod': 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)',
    'checkout.bkash': 'বিকাশ / নগদ / রকেট (ইনস্ট্যান্ট পেমেন্ট)',
    'checkout.sslcommerz': 'SSLCommerz (ডেবিট/ক্রেডিট কার্ড ও মোবাইল ব্যাংকিং)',
    'checkout.stripe': 'Stripe (আন্তর্জাতিক কার্ড / USD)',
    'checkout.placeOrder': 'কনফার্ম অর্ডার করুন',
    'checkout.notes': 'অর্ডার সংক্রান্ত বিশেষ কোনো নোট (ঐচ্ছিক)',

    // Order Success & Track
    'order.successTitle': 'ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
    'order.trackingNo': 'অর্ডার ট্র্যাকিং নম্বর:',
    'order.status': 'অর্ডারের বর্তমান অবস্থা:',
    'order.estimated': 'সম্ভাব্য ডেলিভারির তারিখ:',
    'order.trackBtn': 'অর্ডার ট্র্যাক করুন',
    'order.invoiceBtn': 'ইনভয়েস ডাউনলোড / প্রিন্ট করুন',

    // Footer
    'footer.about': 'ইউনিক কালেকশন ৪.০ একটি প্রিমিয়াম লাইফস্টাইল ও ফ্যাশন ব্র্যান্ড। আমরা গ্রাহকদের কাছে সর্বোচ্চ মানের পোশাক ও পারফেক্ট ফিটিং নিশ্চিত করি।',
    'footer.quickLinks': 'প্রয়োজনীয় লিংক',
    'footer.customerService': 'কাস্টমার সাপোর্ট',
    'footer.policy': 'নীতিমালা ও শর্তাবলী',
    'footer.privacy': 'প্রাইভেসি পলিসি',
    'footer.returns': 'রিটার্ন ও এক্সচেঞ্জ পলিসি',
    'footer.faq': 'সাধারণ জিজ্ঞাসা (FAQ)',
    'footer.contactInfo': 'যোগাযোগ ও শোরুম',
    'footer.address': 'লেভেল ৩, যমুনা ফিউচার পার্ক, কুড়িল, ঢাকা-১২২৯, বাংলাদেশ।',
    'footer.phone': '+৮৮০ ১৭০০-০০০০০০ / +৮৮০ ১৯০০-০০০০০০',
    'footer.email': 'support@uniquecollection.com',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত © ২০২৬ ইউনিক কালেকশন ৪.০'
  },
  en: {
    // Header & Nav
    'store.name': 'Unique Collection 4.0',
    'store.tagline': 'Your Style, Our Responsibility.',
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.categories': 'Categories',
    'nav.newArrivals': 'New Arrivals',
    'nav.bestSellers': 'Best Sellers',
    'nav.offers': 'Offers & Sale',
    'nav.trackOrder': 'Track Order',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'search.placeholder': 'Search Panjabi, Shirt, Borka, Hijab...',
    'free.shipping.bar': '🎉 Cash on Delivery available across Bangladesh! Free shipping on orders over ৳2,000!',
    'cart.title': 'Shopping Bag',
    'wishlist.title': 'Wishlist',
    'account.title': 'My Account',
    'account.login': 'Login / Register',
    'account.dashboard': 'User Dashboard',
    'account.admin': 'Admin Dashboard',
    'account.logout': 'Logout',

    // Product & Buttons
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.quickView': 'Quick View',
    'product.size': 'Select Size',
    'product.color': 'Select Color',
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.stockLeft': 'left in stock',
    'product.reviews': 'reviews',
    'product.fabric': 'Fabric & Material',
    'product.care': 'Care Instructions',
    'product.deliveryInfo': 'Shipping & Delivery',
    'product.deliveryInfoDhaka': 'Delivery inside Dhaka in 24-48 hours (৳70)',
    'product.deliveryInfoOutside': 'Delivery outside Dhaka in 2-3 business days (৳130)',
    'product.codAvailable': 'Cash on Delivery Available Nationwide',

    // Sections
    'section.featuredCategories': 'Featured Categories',
    'section.flashSale': 'Flash Sale - Limited Time Offers',
    'section.newArrivals': 'New Trendy Collection',
    'section.bestSellers': 'Best Sellers',
    'section.brandStory': 'Our Story - Unique Collection 4.0',
    'section.customerReviews': 'Customer Testimonials',
    'section.aiAssistant': 'AI Fashion Stylist',
    'section.aiAssistantDesc': 'Get personalized outfit recommendations based on your occasion, height, and preference!',
    'section.newsletterTitle': 'Subscribe to Our Newsletter',
    'section.newsletterDesc': 'Stay updated with new drops, exclusive promo codes, and style advice.',
    'section.subscribeBtn': 'Subscribe',

    // Cart & Checkout
    'cart.empty': 'Your shopping bag is empty!',
    'cart.subtotal': 'Subtotal',
    'cart.discount': 'Discount Coupon',
    'cart.shipping': 'Shipping Fee',
    'cart.total': 'Total Amount',
    'cart.checkout': 'Proceed to Checkout',
    'cart.applyCoupon': 'Apply Coupon Code',
    'cart.enterCoupon': 'Enter coupon code...',
    'checkout.title': 'Delivery Address & Payment',
    'checkout.fullName': 'Full Name',
    'checkout.phone': 'Mobile Number (11 digits)',
    'checkout.email': 'Email Address',
    'checkout.division': 'Select Division',
    'checkout.district': 'Select District',
    'checkout.thana': 'Thana / Sub-district',
    'checkout.address': 'Full Address (House, Road, Area)',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.cod': 'Cash on Delivery (Pay when received)',
    'checkout.bkash': 'bKash / Nagad / Rocket (Instant Payment)',
    'checkout.sslcommerz': 'SSLCommerz (Debit/Credit Card & Mobile Banking)',
    'checkout.stripe': 'Stripe (International Credit Cards)',
    'checkout.placeOrder': 'Confirm Order',
    'checkout.notes': 'Special order notes (Optional)',

    // Order Success & Track
    'order.successTitle': 'Thank You! Your order has been placed successfully.',
    'order.trackingNo': 'Order Tracking Number:',
    'order.status': 'Current Order Status:',
    'order.estimated': 'Estimated Delivery Date:',
    'order.trackBtn': 'Track Order',
    'order.invoiceBtn': 'Download / Print Invoice',

    // Footer
    'footer.about': 'Unique Collection 4.0 is a premium Bangladeshi fashion brand committed to luxury craftsmanship, modest elegance, and perfect fits.',
    'footer.quickLinks': 'Quick Links',
    'footer.customerService': 'Customer Service',
    'footer.policy': 'Policies',
    'footer.privacy': 'Privacy Policy',
    'footer.returns': 'Return & Exchange Policy',
    'footer.faq': 'Frequently Asked Questions',
    'footer.contactInfo': 'Showroom & Contact',
    'footer.address': 'Level 3, Jamuna Future Park, Kuril, Dhaka-1229, Bangladesh.',
    'footer.phone': '+880 1700-000000 / +880 1900-000000',
    'footer.email': 'support@uniquecollection.com',
    'footer.rights': 'All Rights Reserved © 2026 Unique Collection 4.0'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('uc_language') as Language;
    if (saved && (saved === 'bn' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('uc_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
