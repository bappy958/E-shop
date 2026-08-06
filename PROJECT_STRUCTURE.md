# Unique Collection 4.0 - Comprehensive Project Structure Documentation

This document outlines the architectural organization, component taxonomy, and file directory layout of the Unique Collection 4.0 codebase.

---

## 📂 Root Level Directory Overview

```
/ (Root)
├── .env.example          # Template for required and optional environment variables
├── .gitignore            # Version control exclusions
├── index.html            # Main HTML document template
├── metadata.json         # Platform applet configuration and capabilities
├── package.json          # Dependency definitions and build scripts
├── server.ts             # Node.js Express server & REST API endpoints
├── tsconfig.json         # TypeScript compiler configurations
├── vite.config.ts        # Vite build tool plugins and server rules
└── src/                  # Source application directory
```

---

## 🛠️ Source Directory (`/src`) Detail

### 1. `/src/context/` - State Management Layer
Centralizes application-wide state using React Context.

- **`AuthContext.tsx`**:
  - Manages logged-in user state (`currentUser`).
  - Provides `login()`, `logout()`, `register()`, and `updateProfile()` methods.
  - Persists session credentials in `localStorage` under key `uc_user`.
  - Default super admin preset for email `amsamiul27@gmail.com`.

- **`CartContext.tsx`**:
  - Manages shopping cart items (`cartItems`), quantities, selected sizes/colors.
  - Manages wishlist items (`wishlistItems`).
  - Active coupon state (`appliedCoupon`) and discount calculation.
  - Toast notification engine (`toasts`) with auto-dismiss after 3 seconds.
  - BDT currency formatting helper (`formatPrice`).

- **`LanguageContext.tsx`**:
  - Toggles application language between `'bn'` (Bengali) and `'en'` (English).
  - Supplies bilingual string dictionaries (`translations`) for header, footer, product details, checkout, and admin dashboard.

---

### 2. `/src/data/` - Static & Initial Data Store
- **`initialData.ts`**:
  - Initial dataset containing 8 premium products across Panjabi, Shirts, Abaya/Borka, Hijab, T-Shirts, and Girls fashion.
  - Initial categories (`Panjabi`, `Shirts`, `Abaya & Borka`, `Hijab`, `T-Shirts & Polo`, `Girls Collection`).
  - Initial brands (`Unique Royal`, `Artisan Thread`, `Elegance Abaya`).
  - Initial coupons (`EID2026`, `WELCOME10`, `ROYAL500`).
  - Initial customer reviews and seed orders.

---

### 3. `/src/types/` - TypeScript Interfaces & Types
- **`index.ts`**:
  - `Product`: Complete interface including dual-language titles/descriptions, price, SKU, stock count, fabric specs, tags, and reviews.
  - `Order`: Shipping address, items, order status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`), payment method (`bkash`, `nagad`, `cod`, etc.), tracking number.
  - `User`: ID, name, email, phone, role (`admin` | `customer`), address.
  - `Category`, `Brand`, `Coupon`, `Review`, `Banner`: Entity structures.
  - `AdminAnalyticsData`: Recharts visual analytics payload format.

---

### 4. `/src/components/` - Visual Component Library

#### `components/admin/` - Super Admin Tab Components
- **`AdminAnalyticsView.tsx`**: Visual sales graphs, revenue widgets, order status distributions, and category revenue charts using Recharts.
- **`AdminProductsView.tsx`**: Product table with search, category filtering, add/edit modal, AI description generator, and bulk operations.
- **`AdminCategoriesView.tsx`**: Category list, parent category selection, item count tracking, and status toggling.
- **`AdminBrandsView.tsx`**: Brand list, logo URL preview, and brand creation modal.
- **`AdminOrdersView.tsx`**: Customer orders table, status update modal with status badge colors.
- **`AdminCustomersView.tsx`**: Customer CRM directory with total spent and total orders count.
- **`AdminCouponsView.tsx`**: Discount coupon generator (percentage or flat amount, usage limits, expiration date).
- **`AdminReviewsView.tsx`**: Product reviews moderation table (approve, hide, delete).
- **`AdminInventoryView.tsx`**: Low stock alerts table and one-click re-stock buttons (+10, +50, -1).

#### `components/ai/` - AI Assistant
- **`AIFashionAssistant.tsx`**: Floating AI Stylist drawer. Communicates with `/api/ai/styler` to deliver outfit recommendations based on occasion, weather, and budget.

#### `components/cart/` - Shopping Cart
- **`CartDrawer.tsx`**: Slide-over drawer displaying cart items, quantity modifiers, coupon code input field, free delivery progress bar, and checkout CTA.

#### `components/common/` - Global Reusable UI
- **`Header.tsx`**: Top notification bar, search bar, language toggle, wishlist counter, cart counter, mobile navigation drawer, and user account button.
- **`Footer.tsx`**: Brand logo, quick links, category links, customer support hotline, address, payment gateway logos, and newsletter subscription form.
- **`ProductCard.tsx`**: Reusable product card with discount badges, stock badge, price formatting, quick add-to-cart button, quick view trigger, and wishlist toggle button.
- **`QuickViewModal.tsx`**: Lightbox pop-up displaying product images, size/color selectors, quantity picker, fabric specifications, and direct add-to-cart.
- **`ToastContainer.tsx`**: Toast notification overlay rendering active alerts with auto-dismiss animations.

#### `components/home/` - Homepage Sections
- **`HeroBanner.tsx`**: High-impact promotional hero slider with dual CTA buttons ("Shop Collection", "AI Stylist").
- **`CategoryGrid.tsx`**: Visual card grid of top Bangladeshi fashion categories.
- **`FeaturedProducts.tsx`**: Tabbed product slider (New Arrivals, Best Sellers, Featured).
- **`FlashSale.tsx`**: Limited-time flash sale banner with live countdown timer.
- **`BrandStory.tsx`**: Brand heritage section detailing Bangladeshi craftsmanship.
- **`CustomerReviews.tsx`**: Customer testimonial slider with star ratings.
- **`SocialFeed.tsx`**: Instagram/Facebook community photo grid.

---

### 5. `/src/pages/` - Top-Level Page Views
- **`HomePage.tsx`**: Assembles all homepage sections.
- **`ShopPage.tsx`**: Main store page with multi-filter sidebar (categories, price slider, sale status, sort dropdown).
- **`ProductDetailsPage.tsx`**: Full product detail page with image gallery, review submission form, size guide, fabric info, and related products.
- **`CheckoutPage.tsx`**: Multi-step checkout form (Shipping address, Bangladesh District/Upazila selector, Payment method, Order summary).
- **`OrderSuccessPage.tsx`**: Order confirmation screen with tracking ID and order details.
- **`TrackOrderPage.tsx`**: Real-time order tracking search page.
- **`UserDashboardPage.tsx`**: Customer profile dashboard showing personal info, past orders, and wishlist.
- **`AdminDashboardPage.tsx`**: Super Admin control center containing all 9 tab views.
- **`LoginPage.tsx`**: User and admin login interface with pre-filled demo accounts.
- **`RegisterPage.tsx`**: Customer account registration form.
- **`WishlistPage.tsx`**: Saved wishlist items page.
- **`ContactPage.tsx`**: Customer support hotline, email form, and physical store locations (Dhaka, Chittagong, Sylhet).
- **`AboutPage.tsx`**: Company history, mission, and fashion philosophy.
- **`FAQPage.tsx`**: Frequently asked questions categorized by Delivery, Payment, and Return policy.
