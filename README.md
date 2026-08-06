# Unique Collection 4.0 - Premium Bangladeshi Fashion E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.x-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-v4.21-000000.svg)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-v3.6_Flash-8E44AD.svg)](https://ai.google.dev/)

**Unique Collection 4.0** is a full-stack, enterprise-grade Bangladeshi e-commerce platform specializing in luxury traditional and modern fashion attire including **Men's Designer Panjabi, Premium Shirts, Women's Exclusive Hijab & Abaya Borka, and Girls Fashion Collection**. Built with a modern **MERN stack architecture** (Node.js, Express, React, TypeScript, Tailwind CSS) and integrated with **Google Gemini 3.6 Flash AI**, the platform features real-time BDT (৳) pricing, bKash / Nagad / COD payment simulation, interactive AI Stylist assistant, coupon validation, stock tracking, and a comprehensive Super Admin Management Dashboard.

---

## 🌟 Executive Summary & Key Features

### 🛍️ Customer Experience (Storefront)
- **Royal Luxury Aesthetics**: Rich dark mode and gold theme (`#D4AF37`) tailored for Bangladeshi high-fashion shoppers.
- **Dynamic Product Catalog**: Filterable by Category (Panjabi, Shirts, Hijab, Abaya, T-Shirts, Girls), Price range, Sale status, In-stock, and Rating.
- **Multilingual Support (Bengali & English)**: Seamless toggle between Bengali (বাংলা) and English UI across all components.
- **AI Personal Fashion Assistant ("Unique AI Styler")**: Real-time fashion stylist powered by `@google/genai` (Gemini 3.6 Flash) recommending curated outfits for Eid, weddings, and casual wear.
- **Interactive Quick View & Lightbox**: Image zoom, color swatches, size selectors, fabric details, care instructions, and stock badges.
- **Real-Time Cart Drawer & BDT Currency Formatter**: Dynamic subtotal, free shipping threshold bar, coupon discount application, and sticky checkout buttons.
- **Multi-Step Checkout System**:
  - Bangladeshi District/Upazila selection.
  - Payment Gateways: **bKash**, **Nagad**, **Rocket**, **Bank Transfer**, and **Cash on Delivery (COD)**.
  - Automatic order tracking number generation (`UC-2026-XXXX`).
- **Live Order Tracking**: Instant tracking using order ID or phone number with 5-stage progress indicator.
- **Customer Account Dashboard**: Profile summary, order history with downloadable PDF invoice view, saved addresses, wishlist management, and product reviews.

### 🛡️ Admin & Store Operations (Super Admin Dashboard)
- **Super Admin Analytics Center**: Recharts visual analytics covering total revenue, monthly sales, order status distribution, category breakdown, and top-selling products.
- **Product Operations**:
  - Full CRUD operations with auto SKU/slug generation.
  - AI Description Generator (writes Bengali/English descriptions using Gemini).
  - Bulk actions (Delete, Publish, Hide/Unpublish).
  - Product duplication and low-stock threshold alerts.
- **Category & Brand Management**: Add/edit categories and brands with parent-child hierarchy and status toggles.
- **Order Management Hub**: Filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled), quick status update modal, and customer contact details.
- **Customer CRM**: Spent tracking, total order count, phone/email directory.
- **Promotions & Coupon Engine**: Fixed amount or percentage discount coupons with minimum order limits, usage counts, and expiration dates.
- **Review Moderation**: Approve or delete customer product reviews.
- **Inventory & Stock Manager**: One-click re-stocking (+10, +50, -1) with visual low-stock alerts.

---

## 🛠️ Technology Stack

| Layer | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.8, Vite 6 |
| **Styling & UI Components** | Tailwind CSS v4, Lucide React Icons, Motion (Framer Motion v12) |
| **Data Visualization** | Recharts v3 |
| **Backend Runtime** | Node.js v20, Express v4.21 (TypeScript via `tsx` and bundled with `esbuild`) |
| **AI Integration** | Google Gen AI SDK (`@google/genai` v2.4, Gemini 3.6 Flash model) |
| **State Management** | React Context API (`AuthContext`, `CartContext`, `LanguageContext`) |
| **Build & Tooling** | Vite, esbuild, TypeScript Compiler (`tsc`) |

---

## 🏗️ System Architecture

Unique Collection 4.0 follows a single-process full-stack architecture where Express serves both REST API endpoints (`/api/*`) and handles Vite development middleware (or static asset delivery in production).

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Client (React 19)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (port 3000)
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js App Server                    │
│                                                             │
│  ┌─────────────────────────┐   ┌──────────────────────────┐ │
│  │    REST Controller       │   │  Gemini 3.6 Flash AI     │ │
│  │ (Products, Orders, etc.) │   │  (@google/genai SDK)    │ │
│  └────────────┬────────────┘   └─────────────▲────────────┘ │
│               │                              │              │
│               ▼                              │              │
│  ┌─────────────────────────┐                 │              │
│  │  In-Memory Data Store   │─────────────────┘              │
│  │ (Products, Orders, etc) │                                │
│  └─────────────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Directory Structure

```
├── .env.example            # Environment variables blueprint
├── .gitignore               # Git ignore rules
├── index.html               # Main HTML entry template
├── metadata.json            # AI Studio applet metadata & capabilities
├── package.json             # NPM dependencies and scripts
├── server.ts                # Express backend server entry point
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite bundler configuration
│
├── src/
│   ├── main.tsx             # React DOM root mounting point
│   ├── App.tsx              # Main routing & application state coordinator
│   ├── index.css            # Tailwind CSS styling imports
│   ├── vite-env.d.ts        # Vite environment type definitions
│   │
│   ├── context/             # Global React Context providers
│   │   ├── AuthContext.tsx  # User authentication state & persistent session
│   │   ├── CartContext.tsx  # Shopping cart state, wishlist, coupons & toasts
│   │   └── LanguageContext.tsx # Bengali / English translation dictionary
│   │
│   ├── data/                # Initial seed data datasets
│   │   └── initialData.ts   # Catalog products, categories, brands, orders, etc.
│   │
│   ├── types/               # TypeScript interfaces & types
│   │   └── index.ts         # Product, Order, User, Coupon, Analytics interfaces
│   │
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Admin dashboard tab modules
│   │   ├── ai/              # AI Fashion Assistant modal component
│   │   ├── cart/            # Cart drawer slide-over
│   │   ├── common/          # Header, Footer, ProductCard, QuickView, Toasts
│   │   └── home/            # Homepage sections (Hero, Categories, Flash Sale, etc.)
│   │
│   └── pages/               # Top-level page views
│       ├── HomePage.tsx
│       ├── ShopPage.tsx
│       ├── ProductDetailsPage.tsx
│       ├── CheckoutPage.tsx
│       ├── OrderSuccessPage.tsx
│       ├── TrackOrderPage.tsx
│       ├── UserDashboardPage.tsx
│       ├── AdminDashboardPage.tsx
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── WishlistPage.tsx
│       ├── ContactPage.tsx
│       ├── AboutPage.tsx
│       └── FAQPage.tsx
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **NPM**: v9.0.0 or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-org/unique-collection.git
   cd unique-collection
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key"
   PORT=3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔐 Credentials for Demo Access

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `amsamiul27@gmail.com` | `admin123` | Full access to Admin Dashboard, Analytics, Inventory, Orders |
| **Customer User** | `tanvir@gmail.com` | `user123` | Storefront, Wishlist, User Dashboard, Checkout |

---

## 🔌 API Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | GET | Server status check |
| `/api/products` | GET / POST | List products with filters / Create new product |
| `/api/products/:id` | GET / PUT / DELETE | Get / Update / Delete product |
| `/api/products/bulk-action` | POST | Bulk delete, publish, or hide products |
| `/api/categories` | GET / POST | Category management |
| `/api/brands` | GET / POST | Brand management |
| `/api/orders` | GET / POST | Get orders / Create new customer order |
| `/api/orders/track/:trackingNumber` | GET | Track order by tracking number or ID |
| `/api/coupons` | GET / POST | Coupon management |
| `/api/coupons/validate` | POST | Validate coupon code & calculate discount |
| `/api/admin/analytics` | GET | Store sales and inventory analytics |
| `/api/ai/styler` | POST | AI Fashion Assistant query execution |
| `/api/ai/generate-description` | POST | AI Product Description generation |

---

## 📸 Screenshots Placeholders

- **Homepage Hero**: Luxury Bangladeshi Panjabi & Abaya banner with instant CTA buttons.
- **AI Fashion Assistant**: Conversational pop-up offering custom outfit advice for Eid/Weddings.
- **Admin Dashboard**: Real-time sales charts, revenue metrics, order statuses, and low-stock alerts.
- **Checkout Screen**: Multi-step bKash payment simulation with address verification.

---

## 📄 License & Contact

This project is proprietary software for **Unique Collection 4.0**. All rights reserved.
- **Developer/Admin**: Am Samiul Islam Abir (`amsamiul27@gmail.com`)
- **Support**: `support@uniquecollection.bd`
