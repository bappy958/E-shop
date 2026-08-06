import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Upload,
  X,
  Check,
  Tag,
  Package,
  ArrowUpDown,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { Product, Category, Brand } from '../../types';

interface AdminProductsViewProps {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  formatPrice: (amount: number) => string;
  showToast: (titleBn: string, titleEn: string) => void;
  onRefreshProducts: () => void;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  products,
  categories,
  brands,
  formatPrice,
  showToast,
  onRefreshProducts,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'stock-low'>('newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('panjabi');
  const [brand, setBrand] = useState('Unique Royal');
  const [price, setPrice] = useState<number>(2500);
  const [originalPrice, setOriginalPrice] = useState<number>(3000);
  const [stockCount, setStockCount] = useState<number>(50);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [material, setMaterial] = useState('100% Premium Cotton');
  const [weight, setWeight] = useState('350g');
  const [shortDescriptionBn, setShortDescriptionBn] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [fabricBn, setFabricBn] = useState('১০০% প্রিমিয়াম সুতি');
  const [fabricEn, setFabricEn] = useState('100% Premium Cotton');
  const [careInstructionsBn, setCareInstructionsBn] = useState('হাতে ধুয়ে বাতাসে শুকান।');
  const [careInstructionsEn, setCareInstructionsEn] = useState('Gentle hand wash and line dry.');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'hidden'>('published');

  // Flags
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState('2026-12-31T23:59');

  // Sizes & Colors
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
  const [colors, setColors] = useState<{ nameBn: string; nameEn: string; hex: string }[]>([
    { nameBn: 'কালো', nameEn: 'Black', hex: '#111111' },
  ]);
  const [newColorNameBn, setNewColorNameBn] = useState('');
  const [newColorNameEn, setNewColorNameEn] = useState('');
  const [newColorHex, setNewColorHex] = useState('#D4AF37');

  // Tags
  const [tagsInput, setTagsInput] = useState('panjabi, eid2026, luxury');

  // Image Upload State
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
  ]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // AI Generator state
  const [generatingAi, setGeneratingAi] = useState(false);

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitleBn('');
    setTitleEn('');
    setSlug('');
    setSku(`UC-PAN-${Math.floor(100 + Math.random() * 900)}`);
    setCategory('panjabi');
    setBrand('Unique Royal');
    setPrice(2800);
    setOriginalPrice(3200);
    setStockCount(50);
    setLowStockThreshold(10);
    setMaterial('100% Pure Combed Cotton');
    setWeight('380g');
    setShortDescriptionBn('প্রিমিয়াম কটন ফ্যাব্রিকসে তৈরি রাজকীয় ডিজাইনের পোশাক।');
    setShortDescriptionEn('Royal design crafted with 100% pure combed cotton.');
    setDescriptionBn('');
    setDescriptionEn('');
    setFabricBn('১০০% প্রিমিয়াম কম্বড সুতি');
    setFabricEn('100% Premium Combed Cotton');
    setCareInstructionsBn('হাতে ধুয়ে ড্রায়ারে শুকান।');
    setCareInstructionsEn('Gentle hand wash and line dry.');
    setSeoTitle('');
    setSeoDescription('');
    setStatus('published');
    setIsNewArrival(true);
    setIsBestSeller(false);
    setIsFeatured(true);
    setIsFlashSale(false);
    setFlashSaleEndTime('2026-12-31T23:59');
    setSelectedSizes(['M', 'L', 'XL', 'XXL']);
    setColors([{ nameBn: 'ডিজিটাল ব্ল্যাক', nameEn: 'Digital Black', hex: '#111111' }]);
    setTagsInput('panjabi, eid2026, new');
    setImages(['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']);
    setThumbnailIndex(0);
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitleBn(prod.titleBn || prod.titleEn);
    setTitleEn(prod.titleEn);
    setSlug(prod.slug);
    setSku(prod.sku || `UC-${prod.id}`);
    setCategory(prod.category);
    setBrand(prod.brand || 'Unique Royal');
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || prod.price + 500);
    setStockCount(prod.stockCount);
    setLowStockThreshold(prod.lowStockThreshold || 10);
    setMaterial(prod.material || prod.fabricEn || 'Premium Cotton');
    setWeight(prod.weight || '350g');
    setShortDescriptionBn(prod.shortDescriptionBn || '');
    setShortDescriptionEn(prod.shortDescriptionEn || '');
    setDescriptionBn(prod.descriptionBn);
    setDescriptionEn(prod.descriptionEn);
    setFabricBn(prod.fabricBn);
    setFabricEn(prod.fabricEn);
    setCareInstructionsBn(prod.careInstructionsBn);
    setCareInstructionsEn(prod.careInstructionsEn);
    setSeoTitle(prod.seoTitle || prod.titleEn);
    setSeoDescription(prod.seoDescription || prod.descriptionEn);
    setStatus(prod.status || 'published');
    setIsNewArrival(prod.isNewArrival ?? false);
    setIsBestSeller(prod.isBestSeller ?? false);
    setIsFeatured(prod.isFeatured ?? false);
    setIsFlashSale(prod.isFlashSale ?? false);
    setFlashSaleEndTime(prod.flashSaleEndTime || '2026-12-31T23:59');
    setSelectedSizes(prod.sizes || ['M', 'L', 'XL']);
    setColors(prod.colors || [{ nameBn: 'কালো', nameEn: 'Black', hex: '#111111' }]);
    setTagsInput((prod.tags || []).join(', '));
    setImages(prod.images && prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80']);
    setThumbnailIndex(0);
    setIsModalOpen(true);
  };

  // AI Description Generator Button
  const handleGenerateAiDescription = async () => {
    if (!titleEn) {
      alert('অনুগ্রহ করে পণ্যের ইংরেজি নাম (Product Title En) পূরণ করুন।');
      return;
    }

    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn,
          category,
          fabricEn,
        }),
      });

      const data = await res.json();
      if (data.descriptionBn && data.descriptionEn) {
        setDescriptionBn(data.descriptionBn);
        setDescriptionEn(data.descriptionEn);
        if (data.fabricBn) setFabricBn(data.fabricBn);
        showToast('এআই দ্বারা আকর্ষণীয় প্রডাক্ট ডেসক্রিপশন তৈরি হয়েছে!', 'AI Product description generated successfully!');
      }
    } catch (err) {
      alert('এআই ডেসক্রিপশন তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setGeneratingAi(false);
    }
  };

  // Handle Drag & Drop / File Uploading
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);

    const uploadedUrls: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file, idx) => {
      // FileReader conversion
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, imageName: file.name }),
          });
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        } catch (err) {
          uploadedUrls.push(base64);
        }

        processed++;
        setUploadProgress(Math.round((processed / files.length) * 100));

        if (processed === files.length) {
          setImages((prev) => [...prev, ...uploadedUrls]);
          setIsUploading(false);
          setUploadProgress(100);
          showToast('ছবি সফলভাবে আপলোড করা হয়েছে!', 'Images uploaded successfully!');
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // Add Image URL directly
  const handleAddImageUrl = () => {
    if (!newImageUrl) return;
    setImages((prev) => [...prev, newImageUrl]);
    setNewImageUrl('');
    showToast('ছবির ইউআরএল যুক্ত হয়েছে!', 'Image URL added!');
  };

  // Reorder Images
  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setImages(updated);
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      alert('কমপক্ষে একটি ছবি অবশ্যই থাকতে হবে।');
      return;
    }
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (thumbnailIndex >= updated.length) {
      setThumbnailIndex(0);
    }
  };

  // Add Color Option
  const handleAddColor = () => {
    if (!newColorNameBn && !newColorNameEn) return;
    setColors((prev) => [
      ...prev,
      {
        nameBn: newColorNameBn || newColorNameEn,
        nameEn: newColorNameEn || newColorNameBn,
        hex: newColorHex,
      },
    ]);
    setNewColorNameBn('');
    setNewColorNameEn('');
  };

  // Save Product (Create / Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEn) {
      alert('অনুগ্রহ করে ইংরেজি শিরোনাম দিন।');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      titleBn: titleBn || titleEn,
      titleEn,
      slug: slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku || `UC-${Date.now()}`,
      category,
      brand,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stockCount: Number(stockCount),
      lowStockThreshold: Number(lowStockThreshold),
      thumbnail: images[thumbnailIndex] || images[0],
      images,
      sizes: selectedSizes,
      colors,
      material,
      weight,
      shortDescriptionBn,
      shortDescriptionEn,
      descriptionBn: descriptionBn || 'প্রিমিয়াম কোয়ালিটির রাজকীয় পোশাক।',
      descriptionEn: descriptionEn || 'Premium luxury attire by Unique Collection 4.0.',
      fabricBn,
      fabricEn,
      careInstructionsBn,
      careInstructionsEn,
      seoTitle: seoTitle || titleEn,
      seoDescription: seoDescription || descriptionEn,
      status,
      isNewArrival,
      isBestSeller,
      isFeatured,
      isFlashSale,
      flashSaleEndTime,
      tags: tagsArray,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success || data.product) {
        showToast(
          editingProduct ? 'পণ্যটি সফলভাবে আপডেট হয়েছে!' : 'নতুন পণ্য যুক্ত হয়েছে!',
          editingProduct ? 'Product updated successfully!' : 'New product created successfully!'
        );
        setIsModalOpen(false);
        onRefreshProducts();
      }
    } catch (err) {
      alert('পণ্য সংসংরক্ষণ করতে সমস্যা হয়েছে।');
    }
  };

  // Actions: Delete, Duplicate, Toggle Status
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('পণ্যটি মুছে ফেলা হয়েছে!', 'Product deleted!');
        onRefreshProducts();
      }
    } catch (err) {
      alert('ডিলেট সম্ভব হয়নি।');
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/duplicate/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('পণ্যের কপি তৈরি হয়েছে!', 'Product duplicated!');
        onRefreshProducts();
      }
    } catch (err) {
      alert('ডুপ্লিকেট করতে ব্যর্থ।');
    }
  };

  const handleToggleStatus = async (prod: Product) => {
    const nextStatus = prod.status === 'published' ? 'hidden' : 'published';
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          nextStatus === 'published' ? 'পণ্যটি সাইটে প্রকাশ করা হয়েছে!' : 'পণ্যটি হাইড করা হয়েছে!',
          nextStatus === 'published' ? 'Product published!' : 'Product hidden!'
        );
        onRefreshProducts();
      }
    } catch (err) {
      alert('স্ট্যাটাস পরিবর্তন ব্যর্থ।');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`আপনি কি নির্বাচিত ${selectedIds.length} টি পণ্য মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch('/api/products/bulk-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`বাল্ক একশন ${action} সম্পন্ন হয়েছে!`, `Bulk action ${action} completed!`);
        setSelectedIds([]);
        onRefreshProducts();
      }
    } catch (err) {
      alert('বাল্ক একশন ব্যর্থ হয়েছে।');
    }
  };

  // Filtered & Sorted Products
  let filtered = [...products];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.titleBn || '').toLowerCase().includes(q) ||
        (p.titleEn || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (selectedStatus !== 'all') {
    filtered = filtered.filter((p) => (p.status || 'published') === selectedStatus);
  }

  if (selectedStockStatus === 'in-stock') {
    filtered = filtered.filter((p) => p.inStock && p.stockCount > 0);
  } else if (selectedStockStatus === 'out-of-stock') {
    filtered = filtered.filter((p) => !p.inStock || p.stockCount <= 0);
  } else if (selectedStockStatus === 'low-stock') {
    filtered = filtered.filter((p) => p.stockCount > 0 && p.stockCount <= (p.lowStockThreshold || 10));
  }

  if (sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } else if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'stock-low') {
    filtered.sort((a, b) => a.stockCount - b.stockCount);
  }

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelectId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="text-[#D4AF37]" size={22} />
            <span>পণ্য ব্যবস্থাপনা (Product Management)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">মোট {products.length} টি রাজকীয় পোশাক ক্যাটালগে সংরক্ষিত আছে</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10"
        >
          <Plus size={16} />
          <span>নতুন পণ্য যোগ করুন (Add New Product)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="পণ্য, SKU বা ট্যাগ খুঁজুন (Search product, SKU)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none capitalize"
          >
            <option value="all">সব ক্যাটাগরি (All Categories)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nameBn} ({c.nameEn})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="all">সব স্ট্যাটাস (All Status)</option>
            <option value="published">পাবলিশড (Published)</option>
            <option value="hidden">হাইড করা (Hidden)</option>
            <option value="draft">ড্রাফট (Draft)</option>
          </select>

          {/* Stock Filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="all">সব স্টক অবস্থা (All Stock)</option>
            <option value="in-stock">স্টক আছে (In Stock)</option>
            <option value="low-stock">লো স্টক (Low Stock &lt; 10)</option>
            <option value="out-of-stock">স্টক আউট (Out of Stock)</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-800 text-xs animate-fadeIn">
            <span className="font-bold text-[#D4AF37]">{selectedIds.length} টি সিলেক্ট করা হয়েছে:</span>
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-bold transition-all"
            >
              বাল্ক পাবলিশ
            </button>
            <button
              onClick={() => handleBulkAction('unpublish')}
              className="px-3 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg font-bold transition-all"
            >
              বাল্ক হাইড
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg font-bold transition-all"
            >
              বাল্ক ডিলেট
            </button>
          </div>
        )}
      </div>

      {/* Product Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === paginatedProducts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-0"
                  />
                </th>
                <th className="py-3.5 px-4">পণ্য তথ্য (Product Details)</th>
                <th className="py-3.5 px-4">ক্যাটাগরি & ব্র্যান্ড</th>
                <th className="py-3.5 px-4">মূল্য (Price)</th>
                <th className="py-3.5 px-4 text-center">স্টক পরিমাণ</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">একশন (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-zinc-500">
                    <Package size={36} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-semibold">কোনো পণ্য পাওয়া যায়নি (No products found)</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(prod.id)}
                        onChange={() => toggleSelectId(prod.id)}
                        className="rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.thumbnail || prod.images[0]}
                          alt={prod.titleEn}
                          className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{prod.titleBn || prod.titleEn}</p>
                          <p className="text-[11px] text-zinc-400 font-mono">{prod.titleEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
                              SKU: {prod.sku || prod.id}
                            </span>
                            {prod.isFeatured && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-200 capitalize">{prod.category}</p>
                      <p className="text-[10px] text-zinc-500">{prod.brand || 'Unique Royal'}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <p className="text-[#D4AF37]">{formatPrice(prod.price)}</p>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <p className="text-[10px] text-zinc-500 line-through">{formatPrice(prod.originalPrice)}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          prod.stockCount <= 0
                            ? 'bg-red-500/20 text-red-400'
                            : prod.stockCount <= 10
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {prod.stockCount} টি
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.status === 'hidden'
                            ? 'bg-zinc-800 text-zinc-400'
                            : prod.status === 'draft'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {prod.status === 'hidden' ? 'Hidden' : prod.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleToggleStatus(prod)}
                        title={prod.status === 'published' ? 'হাইড করুন' : 'পাবলিশ করুন'}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                      >
                        {prod.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        title="সম্পাদনা করুন (Edit)"
                        className="p-1.5 bg-zinc-800 hover:bg-[#D4AF37] hover:text-black text-zinc-300 rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDuplicateProduct(prod.id)}
                        title="কপি করুন (Duplicate)"
                        className="p-1.5 bg-zinc-800 hover:bg-blue-500 hover:text-white text-zinc-300 rounded-lg transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        title="মুছে ফেলুন (Delete)"
                        className="p-1.5 bg-zinc-800 hover:bg-red-500 hover:text-white text-zinc-300 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div>
            দেখাচ্ছে {filtered.length > 0 ? startIndex + 1 : 0} থেকে {Math.min(startIndex + itemsPerPage, filtered.length)} (মোট {filtered.length} টি)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-800"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-white font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg disabled:opacity-40 hover:bg-zinc-800"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl rounded-2xl max-h-[90vh] overflow-y-auto p-6 text-white space-y-6 animate-scaleUp my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="text-[#D4AF37]" size={22} />
                  <span>{editingProduct ? 'পণ্য সংশোধন করুন (Edit Product)' : 'নতুন রাজকীয় পণ্য যুক্ত করুন (Add New Product)'}</span>
                </h3>
                <p className="text-xs text-zinc-400">সকল তথ্য ও এআই ডেসক্রিপশন জেনারেটর ফর্ম</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    পণ্যের নাম বাংলা (Title Bn) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: রাজকীয় প্রিমিয়াম কটন এম্ব্রয়ডারি পাঞ্জাবি"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Product Title English *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => {
                      setTitleEn(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Royal Premium Cotton Embroidered Panjabi"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    ইউআরএল স্ল্যাগ (Slug)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    SKU কোড
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">ক্যাটাগরি (Category) *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nameBn} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">ব্র্যান্ড (Brand)</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">বিক্রয় মূল্য (Price BDT) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono font-bold text-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">পূর্বের মূল্য (Original Price)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">স্টক পরিমাণ (Stock Qty) *</label>
                  <input
                    type="number"
                    required
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">লো স্টক অ্যালার্ট থ্রেশহোল্ড</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* IMAGE UPLOADER SYSTEM */}
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                    <ImageIcon size={18} />
                    <span>ছবি গ্যালাড়ি ও থাম্বনেইল ম্যানেজমেন্ট (Multiple Image Upload)</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400">সহযোগিতা: JPG, PNG, WEBP</span>
                </div>

                {/* Drag and drop zone */}
                <div
                  className="border-2 border-dashed border-zinc-800 hover:border-[#D4AF37]/50 rounded-2xl p-6 text-center bg-zinc-900/50 cursor-pointer transition-colors relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto text-[#D4AF37] mb-2" size={28} />
                  <p className="text-xs font-bold text-white">এখানে ছবি ড্র্যাগ করুন অথবা ব্রাউজ করুন (Drag & Drop or Click to Upload)</p>
                  <p className="text-[10px] text-zinc-500 mt-1">একাধিক ছবি একবারে আপলোড করতে পারবেন</p>
                </div>

                {/* Progress bar */}
                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>ছবি প্রসেসিং হচ্ছে...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Direct Image URL Paste option */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="অথবা সরাসরি অনলাইন ছবির লিংক ইউআরএল দিন (Direct Image URL)..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    লিংক যোগ করুন
                  </button>
                </div>

                {/* Gallery List & Thumbnail Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border-2 bg-black ${
                        thumbnailIndex === idx ? 'border-[#D4AF37]' : 'border-zinc-800'
                      }`}
                    >
                      <img src={img} alt="preview" className="w-full h-24 object-cover" />
                      
                      {/* Thumbnail badge */}
                      {thumbnailIndex === idx && (
                        <span className="absolute top-1 left-1 bg-[#D4AF37] text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                          Main Thumbnail
                        </span>
                      )}

                      {/* Controls overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setThumbnailIndex(idx)}
                          title="মেইন থাম্বনেইল করুন"
                          className="p-1 bg-[#D4AF37] text-black rounded text-[10px] font-bold"
                        >
                          Main
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, idx - 1)}
                          disabled={idx === 0}
                          title="বামে সরান"
                          className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] disabled:opacity-30"
                        >
                          &larr;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, idx + 1)}
                          disabled={idx === images.length - 1}
                          title="ডানে সরান"
                          className="p-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] disabled:opacity-30"
                        >
                          &rarr;
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="ডিলেট করুন"
                          className="p-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px]"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTIONS & GEMINI AI GENERATOR */}
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="text-[#D4AF37]" size={18} />
                      <span>প্রডাক্ট ডেসক্রিপশন ও এআই জেনারেটর (Gemini AI Powered)</span>
                    </h4>
                    <p className="text-[11px] text-zinc-400">এক ক্লিকেই আকর্ষণীয় রাজকীয় বিবরণ তৈরি করুন</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={generatingAi}
                    className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-[#D4AF37] text-black font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
                  >
                    <Sparkles size={14} className={generatingAi ? 'animate-spin' : ''} />
                    <span>{generatingAi ? 'এআই তৈরি করছে...' : 'AI দিয়ে বিবরণ লিখুন (Magic Generator)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      সম্পূর্ণ ডেসক্রিপশন (বাংলা)
                    </label>
                    <textarea
                      rows={4}
                      value={descriptionBn}
                      onChange={(e) => setDescriptionBn(e.target.value)}
                      placeholder="বাংলায় বিস্তারিত রাজকীয় বর্ণনা..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Full Description (English)
                    </label>
                    <textarea
                      rows={4}
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Detailed luxury English description..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-white p-3 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SIZES & COLORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-2xl">
                {/* Sizes Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">উপলব্ধ সাইজসমূহ (Available Sizes)</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((sz) => {
                      const isSel = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setSelectedSizes(selectedSizes.filter((s) => s !== sz));
                            } else {
                              setSelectedSizes([...selectedSizes, sz]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSel
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors Manager */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">কালার অপশন (Colors)</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Color En (e.g. Navy)"
                      value={newColorNameEn}
                      onChange={(e) => setNewColorNameEn(e.target.value)}
                      className="w-1/2 bg-zinc-900 border border-zinc-800 text-white px-2 py-1 rounded text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-1 bg-[#D4AF37] text-black font-bold text-xs rounded"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {colors.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-200"
                      >
                        <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></span>
                        <span>{c.nameEn}</span>
                        <X
                          size={12}
                          className="cursor-pointer text-zinc-500 hover:text-red-400"
                          onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FLAGS & STATUS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-950 p-4 border border-zinc-800 rounded-2xl text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#D4AF37]"
                  />
                  <span className="font-semibold text-amber-300">Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#D4AF37]"
                  />
                  <span className="font-semibold text-emerald-300">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#D4AF37]"
                  />
                  <span className="font-semibold text-blue-300">New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-[#D4AF37]"
                  />
                  <span className="font-semibold text-rose-400">Flash Sale</span>
                </label>
              </div>

              {/* STATUS & SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">পাবলিশ স্ট্যাটাস (Status)</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="published">প্রকাশিত (Published)</option>
                    <option value="draft">ড্রাফট (Draft)</option>
                    <option value="hidden">হাইড (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">ট্যাগসমূহ (Comma Separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="panjabi, eid2026, cotton"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Controls */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl text-xs transition-colors"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-black font-extrabold rounded-xl text-xs shadow-lg shadow-[#D4AF37]/20 transition-all"
                >
                  {editingProduct ? 'আপডেট করুন (Save Changes)' : 'পণ্য সংরক্ষণ করুন (Publish Product)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
