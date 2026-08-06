# Unique Collection 4.0 - REST API Documentation

Base URL: `http://localhost:3000/api` (or production host `https://<your-app-domain>/api`)

All requests and responses use `Content-Type: application/json`.

---

## 🟢 1. System Health

### GET `/api/health`
Returns the operational health status of the Express application server.

**Request**:
```http
GET /api/health HTTP/1.1
Host: localhost:3000
```

**Response (200 OK)**:
```json
{
  "status": "ok",
  "store": "Unique Collection 4.0",
  "timestamp": "2026-08-05T19:30:00.000Z"
}
```

---

## 🛍️ 2. Products API

### GET `/api/products`
Retrieves products list with optional filtering and sorting query parameters.

**Query Parameters**:
- `category` (string, optional): Filter by category slug (e.g. `panjabi`, `shirts`, `borka`).
- `search` (string, optional): Search query matching English/Bengali titles, descriptions, SKU, or tags.
- `minPrice` (number, optional): Minimum price threshold in BDT.
- `maxPrice` (number, optional): Maximum price threshold in BDT.
- `onSale` (boolean, optional): Set to `true` to return discounted products.
- `inStock` (boolean, optional): Set to `true` to return only in-stock items.
- `status` (string, optional): `published` | `hidden` | `all`.
- `sortBy` (string, optional): `price-low` | `price-high` | `rating` | `newest`.

**Response (200 OK)**:
```json
[
  {
    "id": "p-1",
    "titleBn": "রাজকীয় প্রিমিয়াম এমব্রয়ডারি পাঞ্জাবি",
    "titleEn": "Royal Luxury Embroidered Panjabi",
    "slug": "royal-luxury-embroidered-panjabi",
    "sku": "UC-PAN-101",
    "category": "panjabi",
    "brand": "Unique Royal",
    "price": 2995,
    "originalPrice": 3495,
    "discountPercent": 14,
    "thumbnail": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    "images": ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"],
    "sizes": ["M", "L", "XL", "XXL"],
    "colors": [{ "nameBn": "কালো", "nameEn": "Black", "hex": "#000000" }],
    "inStock": true,
    "stockCount": 42,
    "lowStockThreshold": 10,
    "rating": 4.9,
    "reviewsCount": 28,
    "fabricBn": "১০০% কটন অ্যান্ড প্রিমিয়াম ভিসকস ব্লেড",
    "fabricEn": "100% Cotton & Premium Viscose Blend",
    "status": "published",
    "createdAt": "2026-08-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/products/:id`
Fetch a single product by its unique `id` or string `slug`.

**Response (200 OK)**: Product object.  
**Response (404 Not Found)**: `{ "error": "Product not found" }`

---

### POST `/api/products`
Creates a new product in the store catalog.

**Request Body**:
```json
{
  "titleBn": "প্রিমিয়াম সুতি শার্ট",
  "titleEn": "Premium Cotton Executive Shirt",
  "category": "shirts",
  "brand": "Unique Royal",
  "price": 1850,
  "originalPrice": 2200,
  "stockCount": 35,
  "sizes": ["M", "L", "XL"],
  "colors": [{ "nameBn": "নেভি ব্লু", "nameEn": "Navy Blue", "hex": "#000080" }],
  "fabricEn": "100% Egyptian Cotton",
  "shortDescriptionEn": "Elegant formal slim fit shirt."
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "product": {
    "id": "p-1722880000000",
    "titleBn": "প্রিমিয়াম সুতি শার্ট",
    "titleEn": "Premium Cotton Executive Shirt",
    "slug": "premium-cotton-executive-shirt",
    "sku": "UC-SHI-482",
    "price": 1850,
    "inStock": true,
    "stockCount": 35,
    "status": "published",
    "createdAt": "2026-08-05T19:30:00.000Z"
  }
}
```

---

### PUT `/api/products/:id`
Updates an existing product by ID.

**Request Body**: Partial product payload.  
**Response (200 OK)**: `{ "success": true, "product": { ... } }`

---

### DELETE `/api/products/:id`
Deletes a product from the database.

**Response (200 OK)**: `{ "success": true, "id": "p-1" }`

---

### POST `/api/products/duplicate/:id`
Clones an existing product with `-copy` slug suffix and duplicate title.

**Response (201 Created)**: `{ "success": true, "product": { ... } }`

---

### POST `/api/products/bulk-action`
Executes bulk operation across multiple product IDs.

**Request Body**:
```json
{
  "action": "delete" | "publish" | "unpublish",
  "ids": ["p-1", "p-2"]
}
```

**Response (200 OK)**: `{ "success": true, "count": 2, "action": "delete" }`

---

## 🏷️ 3. Categories & Brands API

### GET `/api/categories` / POST `/api/categories`
List all categories or create a new category.

### PUT `/api/categories/:id` / DELETE `/api/categories/:id`
Update or remove a category.

### GET `/api/brands` / POST `/api/brands`
List all brands or add a new brand.

---

## 📦 4. Orders API

### GET `/api/orders`
Fetch all customer orders (Admin endpoint).

---

### POST `/api/orders`
Submits a new customer checkout order.

**Request Body**:
```json
{
  "userName": "Md. Tanvir Hossain",
  "userEmail": "tanvir@gmail.com",
  "userPhone": "01711223344",
  "shippingAddress": {
    "district": "Dhaka",
    "upazila": "Dhanmondi",
    "fullAddress": "House 12, Road 5, Dhanmondi, Dhaka"
  },
  "items": [
    {
      "productId": "p-1",
      "titleEn": "Royal Luxury Embroidered Panjabi",
      "price": 2995,
      "quantity": 1,
      "selectedSize": "L",
      "selectedColor": "Black"
    }
  ],
  "subtotal": 2995,
  "shippingCost": 60,
  "discountAmount": 0,
  "totalAmount": 3055,
  "paymentMethod": "bkash",
  "paymentTransactionId": "TRX99887766"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "order": {
    "id": "ord-[#4821]",
    "trackingNumber": "UC-2026-8819",
    "orderStatus": "pending",
    "paymentStatus": "pending",
    "estimatedDeliveryDate": "2026-08-08",
    "createdAt": "2026-08-05T19:30:00.000Z"
  }
}
```

---

### GET `/api/orders/track/:trackingNumber`
Tracks an order using `trackingNumber` (e.g. `UC-2026-8819`) or order ID.

**Response (200 OK)**: Order detail object.  
**Response (404 Not Found)**: `{ "error": "Order not found" }`

---

### PATCH `/api/orders/:id/status`
Updates order status or payment status.

**Request Body**:
```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```

---

## 🎟️ 5. Coupons API

### POST `/api/coupons/validate`
Validates a coupon code against current cart subtotal.

**Request Body**:
```json
{
  "code": "EID2026",
  "subtotal": 3000
}
```

**Response (200 OK)**:
```json
{
  "valid": true,
  "coupon": {
    "code": "EID2026",
    "discountType": "percentage",
    "discountValue": 15,
    "minOrderAmount": 2000
  }
}
```

---

## 🤖 6. AI Services API

### POST `/api/ai/styler`
Queries the AI Personal Stylist for outfit advice based on user intent and occasion.

**Request Body**:
```json
{
  "userMessage": "I need a royal Panjabi for Eid morning under BDT 4000",
  "userLanguage": "en",
  "occasion": "Eid"
}
```

**Response (200 OK)**:
```json
{
  "reply": "Here are our finest royal Panjabis tailored for Eid morning celebrations:",
  "recommendedProducts": [ /* array of matched product objects */ ]
}
```

---

### POST `/api/ai/generate-description`
Generates high-converting product descriptions in Bengali and English using Gemini 3.6 Flash.

**Request Body**:
```json
{
  "titleEn": "Royal Silk Jacquard Panjabi",
  "category": "panjabi",
  "fabricEn": "Raw Silk & Jacquard Weave"
}
```

**Response (200 OK)**:
```json
{
  "descriptionBn": "ইউনিক কালেকশন ৪.০ এর রাজকীয় রেশমি জ্যাকোয়ার্ড পাঞ্জাবি...",
  "descriptionEn": "Sophisticated Royal Silk Jacquard Panjabi crafted for grand celebrations...",
  "fabricBn": "র সিল্ক ও জ্যাকার্ড উইভ",
  "fabricEn": "Raw Silk & Jacquard Weave"
}
```
