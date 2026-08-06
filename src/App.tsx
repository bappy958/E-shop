import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AIFashionAssistant } from './components/ai/AIFashionAssistant';
import { ToastContainer } from './components/common/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname + window.location.search || '/'
  );
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract pathname and query params
  const [pathname, searchString] = currentPath.split('?');
  const searchParams = new URLSearchParams(searchString || '');

  // Render Page Content based on pathname
  const renderPage = () => {
    if (pathname.startsWith('/product/')) {
      const productId = pathname.replace('/product/', '');
      return <ProductDetailsPage productId={productId} onNavigate={handleNavigate} />;
    }

    switch (pathname) {
      case '/shop':
        return <ShopPage onNavigate={handleNavigate} searchParams={searchParams} />;
      case '/checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case '/order-success':
        return (
          <OrderSuccessPage
            orderId={searchParams.get('id') || 'UC-1001'}
            onNavigate={handleNavigate}
          />
        );
      case '/track-order':
        return <TrackOrderPage onNavigate={handleNavigate} searchParams={searchParams} />;
      case '/wishlist':
        return <WishlistPage onNavigate={handleNavigate} />;
      case '/login':
        return <LoginPage onNavigate={handleNavigate} />;
      case '/register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case '/dashboard':
        return <UserDashboardPage onNavigate={handleNavigate} />;
      case '/admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case '/about':
        return <AboutPage onNavigate={handleNavigate} />;
      case '/contact':
        return <ContactPage />;
      case '/faq':
        return <FAQPage />;
      case '/':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentPath={currentPath}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={handleNavigate}
      />

      <AIFashionAssistant onNavigate={handleNavigate} />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

