import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FlashSale } from '../components/home/FlashSale';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BrandStory } from '../components/home/BrandStory';
import { CustomerReviews } from '../components/home/CustomerReviews';
import { SocialFeed } from '../components/home/SocialFeed';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

export const HomePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroBanner onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <FlashSale
        products={products}
        onNavigate={onNavigate}
        onQuickView={(p) => setQuickViewProduct(p)}
      />
      <FeaturedProducts
        products={products}
        onNavigate={onNavigate}
        onQuickView={(p) => setQuickViewProduct(p)}
      />
      <BrandStory onNavigate={onNavigate} />
      <CustomerReviews />
      <SocialFeed />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
