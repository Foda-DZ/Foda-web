# FODA E-Commerce API Documentation

Base URL (dev): `http://localhost:3000/api/v1`
Base URL (prod): `https://foda-backend-hyxw.onrender.com/api/v1`

This document describes every backend endpoint, request/response shape, and the underlying data models. It is written for frontend consumption — field names match the backend exactly (see [Type Reference](#15-type-reference-typescript) for ready-to-use TypeScript types).

---

## Table of Contents

1. [Global Conventions](#1-global-conventions)
2. [Auth](#2-auth--apiv1auth)
3. [Cart](#3-cart--apiv1cart)
4. [Products](#4-products--apiv1products)
5. [Customer](#5-customer--apiv1customer)
6. [Seller — Products](#6-seller-products--apiv1sellerproducts)
7. [Seller — Orders](#7-seller-orders--apiv1sellerorders)
8. [Seller — Inventory](#8-seller-inventory--apiv1sellerinventory)
9. [Seller — Settings & Setup](#9-seller-settings--setup)
10. [Seller — Meta Ads](#10-seller-meta-ads--apiv1sellermeta-ads)
11. [Seller — Promotions, Traffic, Analytics, Confirmators, Collections](#11-seller--other-resources)
12. [Confirmator](#12-confirmator--apiv1confirmator)
13. [Delivery Companies](#13-delivery-companies--apiv1delivery-companies)
14. [Storefront & Public Collections](#14-storefront--public-collections)
15. [Type Reference (TypeScript)](#15-type-reference-typescript)
16. [Mongoose Models](#16-mongoose-models)
17. [External Integrations](#17-external-integrations)

---

## 1. Global Conventions

### Auth header

Every authenticated request must send:

```
Authorization: Bearer <accessToken>
```

The access token is a JWT (`{ id, email, role }`), valid **1 day in production / 7 days in dev**. Middleware attaches the decoded principal to `req.customer`, `req.seller`, or `req.confirmator` depending on `role`.

### Refresh token

Issued as an **HttpOnly cookie** named `refreshToken` (7-day expiry) on register/verify/login/OAuth. Never exposed in JSON. To get a new access token:

```
GET /api/v1/auth/refresh        (customer/seller)
POST /api/v1/confirmator/auth/refresh   (confirmator)
```

Both read the cookie and return `{ accessToken }`. Requests must be made with credentials (`withCredentials: true` in Axios) so the cookie is sent.

### Error format

```json
{
  "success": false,
  "error": {
    "message": "Human readable error message",
    "stack": "only present when NODE_ENV=development"
  }
}
```

Status code is set per-error (400, 401, 403, 404, 409, 502, etc.), default 500. Zod validation failures return `400` with only the **first** validation issue's message (not a full array).

Multer upload errors are normalized to `400` with:
- `"File too large (max 5MB)"`
- `"Only image files are allowed"`

### Pagination (where used — seller inventory, seller collections)

Query params: `page` (default 1), `limit` (default 20, max 100), `search` (case-insensitive regex on `name`).

Response includes: `{ total, page, limit, totalPages }` alongside the item list.

### No global success envelope

There is no single wrapper — each endpoint returns its own shape, commonly `{ message, <resourceKey> }`. Check each endpoint's documented response below.

### Image objects

Any uploaded image (product images, seller logo, customer avatar, collection cover) is stored via Cloudinary and shaped as:

```ts
interface ApiImageObject {
  url: string;
  publicId: string;
}
```

---

## 2. Auth — `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register/customer` | Public | Register a customer |
| POST | `/auth/register/seller` | Public | Register a seller |
| POST | `/auth/verify` | Public | Verify email with 6-digit code |
| POST | `/auth/login` | Public | Login (customer/seller/admin) |
| GET | `/auth/refresh` | Cookie | Refresh access token |
| POST | `/auth/logout` | Cookie | Logout, clears refresh cookie |
| GET | `/auth/google?role=customer\|seller` | Public | Start Google OAuth |
| GET | `/auth/google/callback` | Public | Google OAuth redirect target |
| GET | `/auth/facebook?role=customer\|seller` | Public | Start Facebook OAuth |
| GET | `/auth/facebook/callback` | Public | Facebook OAuth redirect target |

### POST `/auth/register/customer`

**Body**
```ts
{
  fullName: string; // min length 3
  email: string;    // valid email
  password: string; // min length 8
}
```

**Response `201`**
```json
{ "message": "string" }
```
Account is unverified until `/auth/verify` is called (a verification code is emailed).

**Errors:** `400` duplicate email, `400` Zod validation message.

---

### POST `/auth/register/seller`

**Body**
```ts
{
  shopName: string; // min length 3
  email: string;
  password: string; // min length 8
}
```

**Response `201`**: `{ "message": "string" }`

---

### POST `/auth/verify`

**Body**
```ts
{
  email: string;
  verificationCode: number; // 6 digits, 100000–999999
}
```

**Response `200`**
```ts
{
  message: string;
  customer: ApiCustomer | null;
  seller: ApiSeller | null; // note: shape differs slightly from login (see below)
  accessToken: string;
}
```
Sets `refreshToken` cookie.

`customer` shape:
```ts
{ id: string; fullName: string; email: string; phoneNumber: string | null; imageUrl: ApiImageObject | null }
```

`seller` shape (on verify — no `isActive` field here):
```ts
{ id: string; shopName: string; email: string; phone: string | null; imageUrl: string | null }
```

---

### POST `/auth/login`

**Body**
```ts
{
  email: string;
  password: string; // min length 8
  role: "customer" | "seller" | "admin";
}
```

**Response `200`**
```ts
{
  message: string;
  customer: ApiCustomer | null;
  seller: ApiSeller | null;
  accessToken: string;
}
```
Sets `refreshToken` cookie.

`seller` shape (on login):
```ts
{
  id: string;
  shopName: string;
  email: string;
  phone: number | null;
  logoUrl: string | null;
  isActive: boolean;
}
```

**Errors:**
- `400 "Invalid credentials"`
- `400 "Please verify your email to login"`
- `400` — attempting password login on an OAuth-only account

---

### GET `/auth/refresh`

Requires `refreshToken` cookie.

**Response `200`**: `{ "accessToken": "string" }`
**Errors:** `401` missing cookie, `403 "Invalid refresh token"`.

---

### POST `/auth/logout`

Requires `refreshToken` cookie. Clears it server-side.

**Response `200`**: `{ "message": "Logout successful" }`
**Errors:** `400 "No refresh token found"`.

---

### OAuth flows

`GET /auth/google?role=customer|seller` and `GET /auth/facebook?role=customer|seller` redirect to the provider. After consent, the provider redirects back to `.../callback?code&state`, which the backend handles and then **redirects the browser** to:

```
${FRONTEND_URL}/auth/callback#accessToken=<jwt>&role=<role>&isNew=<bool>&user=<base64 JSON>
```

Sets `refreshToken` cookie. On failure, redirects with `?error=<message>` instead. The frontend's `/auth/callback` route must parse the URL fragment.

---

## 3. Cart — `/api/v1/cart`

All routes require `Authorization: Bearer <token>` with role **customer**.

| Method | Path | Description |
|---|---|---|
| GET | `/cart` | Get current customer's cart |
| POST | `/cart/items/:id` | Add item (`:id` = productId) |
| DELETE | `/cart/items/:id` | Remove item (`:id` = productId) |
| GET | `/cart/checkout/shipping-fees` | Get shipping fee quote |
| POST | `/cart/checkout` | Convert cart to order(s) |
| DELETE | `/cart/clear` | Empty the cart |

### GET `/cart`

**Response `200`**: `{ "cart": ApiCart }`
**Errors:** `404` if no cart exists yet for this customer.

### POST `/cart/items/:id`

**Body**
```ts
{
  size: string;
  color: string;
  quantity?: number; // 1–99, default 1
}
```

**Response `200`**: `{ "message": "Item added to cart successfully", "cart": ApiCart }`

Stock is enforced per-variant at insert time (transactional).

### DELETE `/cart/items/:id`

**Body or query params** (one of the two combinations required):
```ts
{ variantId: string } | { size: string; color: string }
```

**Response `200`**: `{ "message": "Item removed from cart successfully", "cart": ApiCart }`

### GET `/cart/checkout/shipping-fees`

**Query/body**
```ts
{ productId: string; to_wilaya: string }
```

**Response `200`**: `{ "shippingFees": ApiCheckoutShippingFeesResponse["shippingFees"] }` — raw pass-through of the Dolivroo shipping-fee response (see [§15](#15-type-reference-typescript)).

### POST `/cart/checkout`

**Body**
```ts
{
  shippingDetails: ApiShippingDetails;
  shippingFees?: { sellerId: string; shippingFee: number }[];
}
```

**Response `201`**
```json
{ "message": "Checkout successful, orders created", "orders": [/* ApiOrder */] }
```

One `Order` document is created **per seller** present in the cart. Each order's item stock is atomically decremented (`variants.$.stock`) in a MongoDB transaction; the cart is cleared on success.

### DELETE `/cart/clear`

**Response `200`**: `{ "message": "Cart cleared successfully" }`

---

## 4. Products — `/api/v1/products`

All public except review submission.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | Public | Search/browse products |
| GET | `/products/:id` | Public | Get one product |
| POST | `/products/:id/review` | Customer | Submit a review |
| GET | `/products/:id/share` | Public | Get social share links |
| POST | `/products/:id/visit` | Public | Log a traffic visit (beacon) |
| GET | `/products/:id/reviews` | Public | List reviews for a product |

### GET `/products`

**Query params**
```ts
{
  search?: string;       // full-text search (Mongo $text index on name+description)
  mainCategory?: string; // e.g. "Men"
  subCategory?: string;  // e.g. "Shirts"
  category?: string;     // legacy alias for mainCategory
}
```
Returns at most 20 results. No pagination.

**Response `200`**: `{ "products": ApiProduct[] }`

### GET `/products/:id`

**Response `200`**: `{ "product": ApiProduct }`
**Errors:** `404` not found.

### POST `/products/:id/review` (customer)

**Body**
```ts
{
  rating: number;  // 1–5 (coerced from string if needed)
  comment: string; // non-empty
}
```

**Response `200`**: `{ "message": "string", "review": ApiReview }`
**Errors:** `400` if this customer already reviewed the product. Also recalculates and updates the seller's aggregate `rating`.

### GET `/products/:id/share`

**Response `200`**
```json
{
  "message": "string",
  "share": {
    "productUrl": "string",
    "platforms": {
      "whatsapp": "string",
      "facebook": "string",
      "telegram": "string",
      "instagram": "string"
    }
  }
}
```

### POST `/products/:id/visit`

**Body**
```ts
{
  source?: "instagram" | "tiktok" | "whatsapp" | "facebook" | "foda"; // default "foda"
  visitorId?: string;
  deviceType?: "mobile" | "desktop" | "tablet";
  referrer?: string;
}
```

**Response `204 No Content`** — fire-and-forget analytics beacon.

### GET `/products/:id/reviews`

**Response `200`**: `{ "reviews": ApiProductReview[] }` — each review's `customerId` is populated with `{ _id, fullName }`.

---

## 5. Customer — `/api/v1/customer`

All routes require `Authorization: Bearer <token>` with role **customer**.

| Method | Path | Description |
|---|---|---|
| GET | `/customer/profile` | Get own profile |
| GET | `/customer/orders` | List own orders |
| POST | `/customer/profile/image` | Upload avatar (multipart) |
| GET | `/customer/wishlist` | Get wishlist products |
| POST | `/customer/wishlist/:id` | Add product to wishlist |
| DELETE | `/customer/wishlist/:id` | Remove product from wishlist |

### GET `/customer/profile`

**Response `200`**: the raw `Customer` document (⚠️ **not** wrapped in a `{ customer: ... }` key), with `password`, `verificationCode`, `__v` excluded:
```ts
ApiCustomerProfile
```

### GET `/customer/orders`

**Response `200`**: `{ "message": "string", "orders": ApiOrder[] }`

### POST `/customer/profile/image`

`multipart/form-data`, field name **`ProfileImage`**, single file, max 5MB, `jpg|png|webp` only.

**Response `200`**: `{ "message": "string", "imageUrl": "string" }` (Cloudinary URL)

### GET `/customer/wishlist`

**Response `200`**: `{ "message": "string", "wishlist": ApiProduct[] }`

### POST `/customer/wishlist/:id`

**Response `200`**: `{ "message": "Product added to wishlist successfully" }`
**Errors:** `400` already in wishlist, `404` product not found.

### DELETE `/customer/wishlist/:id`

**Response `200`**: `{ "message": "Product removed from wishlist successfully" }`
**Errors:** `404` not in wishlist.

---

## 6. Seller — Products — `/api/v1/seller/products`

All routes require `Authorization: Bearer <token>` with role **seller**.

| Method | Path | Description |
|---|---|---|
| POST | `/seller/products` | Create product (multipart) |
| PUT | `/seller/products/:id` | Update product |
| DELETE | `/seller/products/:id` | Delete product |
| GET | `/seller/products` | List own products |

### POST `/seller/products`

`multipart/form-data`, field name **`images`** (array, max 5 files, 5MB each), plus form fields:

```ts
{
  name: string;
  brand: string;
  price: number;        // > 0
  mainCategory: "Men" | "Women" | "Kids" | "Accessories" | "Other";
  subCategory: "Shirts" | "Pants" | "Dresses" | "Shoes" | "Jackets" | "Hoodies"
             | "Jeans" | "Shorts" | "T-Shirts" | "Sweaters" | "Coats" | "Bags"
             | "Hats" | "Other";
  description?: string;
  sizes: string[];   // unique, ≥1 — must match the subCategory's valid size set (see below)
  colors: string[];  // unique, ≥1
  promotion?: {
    active?: boolean;
    type: "percentage" | "amount";
    value: number;      // 0–100 if percentage, ≥0 if amount
    code?: string;       // 3–20 chars, [A-Za-z0-9_-]
    startDate?: string;
    endDate?: string;    // must be ≥ startDate
  };
}
```

**Size validation by sub-category** (`src/utils/productSizeValidator.ts`):
- `Shoes` → `"36"`–`"48"`
- `Bags`, `Hats`, `Accessories` → `"One Size"`
- everything else → `XS | S | M | L | XL | XXL`

Mismatched sizes return `400`.

**Response `201`**: `{ "message": "string", "product": ApiProduct }`

### PUT `/seller/products/:id`

Same `productSchema` body as create (no new file upload on this path; stock is not editable here — use the inventory endpoint).

**Response `200`**: `{ "message": "string", "product": ApiProduct }`

### DELETE `/seller/products/:id`

**Response `200`**: `{ "message": "string" }`

### GET `/seller/products`

**Response `200`**: `{ "products": ApiProduct[] }`

---

## 7. Seller — Orders — `/api/v1/seller/orders`

| Method | Path | Description |
|---|---|---|
| GET | `/seller/orders` | List orders for this seller |
| PUT | `/seller/orders/:id` | Update order status |
| GET | `/seller/orders/:id/label` | Download shipping label PDF |

### GET `/seller/orders`

**Response `200`**: `{ "orders": ApiOrder[] }` — `customerId` populated with `{ fullName, email }`.

### PUT `/seller/orders/:id`

**Body**
```ts
{ status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" }
```

**Response `200`**: `{ "message": "string", "order": ApiOrder }`

When confirming, the backend calls Dolivroo `POST /unified/parcels` to create the actual delivery order.

### GET `/seller/orders/:id/label`

**Response `200`**: binary PDF (`Content-Type: application/pdf`), proxied from Dolivroo. Not JSON — handle as a blob/file download on the frontend.

---

## 8. Seller — Inventory — `/api/v1/seller/inventory`

| Method | Path | Description |
|---|---|---|
| GET | `/seller/inventory/stats` | Inventory-wide stats |
| GET | `/seller/inventory` | Paginated inventory list |
| PUT | `/seller/inventory/:id` | Update stock/sku for a product's variants |

### GET `/seller/inventory`

**Query**: `page?`, `limit?` (≤100), `search?`

**Response `200`**
```ts
{
  inventory: {
    items: (ApiProduct & { lowestVariantStock: number })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}
```

### GET `/seller/inventory/stats`

**Response `200`**
```ts
{
  stats: {
    totalActive: number;
    lowStock: number;
    outOfStock: number;
    outOfStockVariants: number;
    totalUnits: number;
    lowStockItems: ApiProduct[];
    outOfStockItems: ApiProduct[];
  }
}
```

### PUT `/seller/inventory/:id`

**Body**
```ts
{
  variants: {
    variantId?: string;
    size: string;
    color: string;
    stock: number; // integer ≥ 0
    sku?: string;
  }[]; // at least 1 entry
}
```

**Response `200`**: `{ "message": "Inventory updated", "product": ApiProduct }`

---

## 9. Seller — Settings & Setup

| Method | Path | Description |
|---|---|---|
| PUT | `/seller/settings` | Update shop settings / logo |
| POST | `/seller/complete-setup` | Complete onboarding (delivery integration) |

### PUT `/seller/settings`

`multipart/form-data`, optional field **`logo`**, plus form fields:
```ts
{
  shopName?: string; // min length 3
  phone?: number;
  wilaya?: string;   // min length 2 — wilaya & commune must both be present or both absent
  commune?: string;  // min length 2
}
```

**Response `200`**: `ApiSellerSettingsResponse`
```ts
{
  message: string;
  seller: {
    id: string;
    shopName: string;
    email: string;
    phone: number | null;
    address: { wilaya: string; commune: string } | null;
    logoUrl: string | null;
  };
}
```

### POST `/seller/complete-setup`

**Body**
```ts
{
  wilaya: string;               // min length 2
  commune: string;               // min length 2
  deliveryCompany: string;       // min length 2
  seller_delivery_token: string; // min length 10
}
```

**Response `200`**: `ApiCompleteSellerSetupResponse`
```ts
{
  message: string;
  seller: {
    _id: string;
    shopName: string;
    email: string;
    address: { wilaya: string; commune: string };
    company_code: string;
    connection_label: string;
  };
}
```

Internally registers the seller's delivery credentials with Dolivroo (`POST /unified/credentials`).

---

## 10. Seller — Meta Ads — `/api/v1/seller/meta-ads`

Facebook/Meta Conversions API + Ads Insights integration.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/seller/meta-ads/oauth/start` | Seller | Get Meta OAuth URL |
| PUT | `/seller/meta-ads` | Seller | Alias for oauth/start |
| GET | `/seller/meta-ads/oauth/callback` | Public (Meta redirect) | Complete OAuth |
| DELETE | `/seller/meta-ads` | Seller | Disconnect Meta Ads |
| GET | `/seller/meta-ads` | Seller | Get dashboard data |
| POST | `/seller/meta-ads/sync` | Seller | Force-sync insights |
| GET | `/seller/meta-ads/events` | Seller | List tracked events |
| POST | `/seller/meta-ads/test-event` | Seller | Send a test event |
| GET | `/seller/meta-ads/pixels-and-pages` | Seller | List available pixels/pages |
| POST | `/seller/meta-ads/configure-pixel-and-page` | Seller | Set active pixel/page |
| GET | `/seller/meta-ads/status` | Seller | Connection status |
| POST | `/seller/meta-ads/events` | **Public** | Server-to-server event ingestion (Conversions API) |

### GET `/seller/meta-ads/oauth/start`

**Response `200`**
```json
{ "message": "string", "authUrl": "string", "state": "string", "expiresInSeconds": 900 }
```

### GET `/seller/meta-ads/oauth/callback`

**Query**: `code: string`, `state: string`, `adAccountId?: string`

**Response `200`**
```ts
{
  message: string;
  sellerId: string;
  shopName: string;
  selectedAccount: object;
  availableAccounts: object[];
  metaAds: SafeMetaAds; // never includes raw accessToken
}
```

### DELETE `/seller/meta-ads`

**Response `200`**: `{ "message": "string" }`

### GET `/seller/meta-ads`

**Query**: `datePreset?: string`, `startDate?: string`, `endDate?: string`

**Response `200`**
```ts
{
  dashboard: {
    sellerId: string;
    shopName: string;
    email: string;
    dateRange: object;
    kpis: object;
    campaigns: object[];
    tracking: { trackingKey: string; recentEvents: ApiMetaAdsEvent[] };
    metaAds: SafeMetaAds;
  }
}
```

### POST `/seller/meta-ads/sync`

Same query/body as above. **Response `200`**: `{ message, seller: <same dashboard shape as above> }`

### GET `/seller/meta-ads/events`

Same date-range query. Returns tracked events list.

### POST `/seller/meta-ads/test-event`

**Response `200`**: sends a synthetic test event through the pipeline.

### GET `/seller/meta-ads/pixels-and-pages`

**Response `200`**: available Meta pixels and pages for the connected ad account.

### POST `/seller/meta-ads/configure-pixel-and-page`

**Body**: `{ pixelId?: string; pageId?: string }`

### GET `/seller/meta-ads/status`

**Response `200`**
```ts
{
  sellerId: string;
  isConnected: boolean;
  adAccountId: string | null;
  adAccountName: string | null;
  pixelId: string | null;
  pageId: string | null;
  hasAccessToken: boolean;
  connectedAt: string | null;
  issues: string[];
  isFullyConfigured: boolean;
}
```

### POST `/seller/meta-ads/events` (Public — server-to-server)

**Body**
```ts
{
  sellerId: string;
  trackingKey: string; // ≥12 chars, secret per-seller (from tracking.trackingKey above)
  eventName: string;
  eventId?: string;
  eventTime?: number;      // unix seconds
  eventSourceUrl?: string;
  actionSource?: string;
  userData?: object;
  customData?: object;
}
```

**Response `201`**: `{ "message": "string", "event": ApiMetaAdsEvent }`

---

## 11. Seller — Other Resources

### Promotions — `/api/v1/seller/promotions`

| Method | Path | Description |
|---|---|---|
| GET | `/seller/promotions` | List products with promotions |
| GET | `/seller/promotions/:id` | Get one product's promotion |
| POST | `/seller/promotions/:id` | Create/update a product's promotion |
| DELETE | `/seller/promotions/:id` | Remove a product's promotion |

**POST body** (raw, not strictly Zod-validated at this layer):
```ts
{
  active: boolean;
  type: "percentage" | "amount";
  value: number;
  startDate?: string;
  endDate?: string;
}
```

**Responses:**
- List → `200 { "promotions": ApiProduct[] }`
- Create/update → `200 { "message": "Promotion saved", "product": ApiProduct }`
- Delete → `200 { "message": "Promotion removed", "product": ApiProduct }`

---

### Traffic Analytics — `/api/v1/seller/traffic`

| Method | Path | Description |
|---|---|---|
| GET | `/seller/traffic/overview` | Aggregate visit/order stats |
| GET | `/seller/traffic/sources` | Breakdown by traffic source |
| GET | `/seller/traffic/export` | CSV export |

**Query (all three)**
```ts
{
  range?: "today" | "7d" | "30d" | "custom";
  from?: string;
  to?: string;
  productId?: string;
}
```

**GET `/seller/traffic/overview` → `200`**
```ts
{ "overview": TrafficOverview } // see §15
```

**GET `/seller/traffic/sources` → `200`**
```ts
{ "sources": TrafficSourceRow[] } // see §15
```

**GET `/seller/traffic/export` → `200`**: `text/csv` file download.

---

### Analytics — `/api/v1/seller/analytics`

| Method | Path | Description |
|---|---|---|
| GET | `/seller/analytics/product/:id` | Per-product sales analytics |
| GET | `/seller/analytics/revenue` | Store-wide revenue analytics |

**GET `/seller/analytics/product/:id`**

**Query**: `startDate?: string`, `endDate?: string`

**Response `200`**
```ts
{
  analytics: {
    bySize: { _id: string; unitsSold: number; revenue: number }[];
    totals: { unitsSold: number; revenue: number; orders: number };
  }
}
```

**GET `/seller/analytics/revenue`**

**Response `200`**
```ts
{
  analytics: {
    totalRevenue: { value: number; count: number };
    pendingRevenue: number;
    available: number;
    thisMonth: number;
    daily: { _id: string; revenue: number; orders: number }[];
    recentOrders: {
      _id: string;
      status: ApiOrderStatus;
      totalAmount: number;
      createdAt: string;
      shippingDetails: { wilaya: string };
    }[];
  }
}
```

---

### Confirmators — `/api/v1/seller/confirmators`

Confirmators are order-confirmation staff a seller can invite.

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/seller/confirmators` | `{ email: string; fullName: string }` | Invite a confirmator |
| GET | `/seller/confirmators` | — | List confirmators |
| DELETE | `/seller/confirmators/:id` | — | Remove a confirmator |

**Responses:**
- Invite → `200 { "confirmator": ApiConfirmator, "message": "string" }`
- List → `200 { "confirmators": ApiConfirmator[] }`
- Remove → `200 { "message": "string" }`

---

### Seller Collections — `/api/v1/seller/collections`

| Method | Path | Description |
|---|---|---|
| POST | `/seller/collections` | Create collection (multipart) |
| GET | `/seller/collections` | List own collections (paginated) |
| GET | `/seller/collections/:id` | Get one collection |
| PUT | `/seller/collections/:id` | Update collection |
| DELETE | `/seller/collections/:id` | Delete collection |

### POST `/seller/collections`

`multipart/form-data`, optional field **`coverImage`**, plus:
```ts
{
  name: string;          // required, ≤100 chars
  description?: string;  // ≤500 chars
  products?: string[];   // product IDs — must belong to this seller
}
```

**Response `201`**: `{ "message": "string", "collection": ApiCollection }`

### GET `/seller/collections`

**Query**: `page?`, `limit?`, `search?`

**Response `200`** (⚠️ result is spread directly, not nested under a key):
```ts
{
  collections: ApiCollection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### GET `/seller/collections/:id`

**Response `200`**: `{ "collection": ApiCollection }` — `products` populated with `{ name, images, price, totalStock, inStock }`.

### PUT `/seller/collections/:id`

Same fields as create, all optional.

**Response `200`**: `{ "message": "string", "collection": ApiCollection }`

### DELETE `/seller/collections/:id`

**Response `200`**: `{ "message": "string" }`

---

## 12. Confirmator — `/api/v1/confirmator`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/confirmator/auth/login` | Public | Login with invite token |
| POST | `/confirmator/auth/refresh` | Cookie | Refresh access token |
| POST | `/confirmator/auth/logout` | Cookie | Logout |
| GET | `/confirmator/orders` | Confirmator | List pending orders for their seller |
| POST | `/confirmator/orders/:id` | Confirmator | Confirm or cancel an order |
| GET | `/confirmator/inventory` | Confirmator | View seller's inventory |

### POST `/confirmator/auth/login`

**Body**
```ts
{ email: string; accessToken: string } // the long-lived invite token issued when the seller added them
```

**Response `200`**: `{ "message": "string", "confirmator": object, "accessToken": "string" }` + sets `refreshToken` cookie.

### POST `/confirmator/auth/refresh`

**Response `200`**: `{ "accessToken": "string" }`

### POST `/confirmator/auth/logout`

**Response `200`**: `{ "message": "string" }`

### GET `/confirmator/orders`

**Response `200`**: `{ "message": "string", "orders": ApiOrder[] }` — only `status: "pending"` orders, `customerId` populated with `{ fullName, email }`.

### POST `/confirmator/orders/:id`

**Body**
```ts
{ status: "confirm" | "cancel"; reason?: string }
```

**Response `200`**: `{ "message": "string", "order": ApiOrder }`

- On `"confirm"`: creates a Dolivroo parcel, sets `order.status = "confirmed"`, populates `tracking_id` and `managedBy`.
- On `"cancel"`: sets `order.status = "cancelled"`, stores `reason`.

### GET `/confirmator/inventory`

**Response `200`**: `{ "message": "string", "products": ApiProduct[] }`

---

## 13. Delivery Companies — `/api/v1/delivery-companies`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/delivery-companies` | Public | List supported delivery companies |

**Response `200`**: `ApiDeliveryCompaniesResponse`
```ts
{ companies: { name: string; api_code: string; company_code: string; logo: string }[] }
```

---

## 14. Storefront & Public Collections

### Storefront — `/api/v1/storefront`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/storefront/:sellerId` | Public (optional customer) | Public seller profile page |
| GET | `/storefront/:sellerId/products` | Public | Seller's public products |
| POST | `/storefront/:sellerId/follow` | Customer | Follow a seller |
| DELETE | `/storefront/:sellerId/follow` | Customer | Unfollow a seller |

If a customer is logged in (optional JWT — request is not blocked without one), `isFollowing` reflects their follow state.

### GET `/storefront/:sellerId`

**Response `200`**: `{ "seller": ApiSellerProfile }`
```ts
interface ApiSellerProfile {
  id: string;
  shopName: string;
  logoUrl: string | null;
  phone: number | null;
  address: { wilaya: string; commune: string } | null;
  isVerified: boolean;
  verifiedBadge: boolean;
  memberSince: string; // ISO date
  productCount: number;
  followers: number;
  isFollowing: boolean;
}
```

### GET `/storefront/:sellerId/products`

**Response `200`**: `{ "products": ApiProduct[] }` — max 12, newest first.

### POST `/storefront/:sellerId/follow`

**Response `200`**: `{ "message": "Seller followed", "followers": number }`

### DELETE `/storefront/:sellerId/follow`

**Response `200`**: `{ "message": "Seller unfollowed", "followers": number }`

---

### Public Collections — `/api/v1/collections`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/collections` | Public | Featured collections (landing page) |
| GET | `/collections/:id` | Public | Collection detail |

### GET `/collections`

Max 10 results, newest first.

**Response `200`**
```ts
{
  collections: (ApiCollection & {
    products: ApiCollectionProduct[]; // populated: name, images, price, totalStock, inStock
  })[]
}
```

### GET `/collections/:id`

**Response `200`**
```ts
{
  collection: ApiCollection & {
    products: (ApiCollectionProduct & {
      mainCategory: ApiCategory;
      subCategory: ApiSubCategory;
      description: string;
      sizes: string[];
      colors: string[];
      variants: ApiVariant[];
      sellerId: string;
      createdAt: string;
    })[];
  }
}
```

**Errors:** `404` not found, `400` invalid ObjectId.

---

## 15. Type Reference (TypeScript)

These mirror `src/types/api.ts` in the frontend — use these names directly when consuming responses.

```ts
// ─── Shared ───────────────────────────────────────────────────────────
interface ApiImageObject {
  url: string;
  publicId: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────
interface ApiCustomer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  imageUrl: ApiImageObject | null;
}

interface ApiSeller {
  id: string;
  shopName: string;
  email: string;
  phone: number | null;
  logoUrl: string | null;
  isActive: boolean;
}

interface ApiAuthResponse {
  message: string;
  customer: ApiCustomer | null;
  seller: ApiSeller | null;
  accessToken: string;
}

// ─── Products ─────────────────────────────────────────────────────────
type ApiCategory = "Men" | "Women" | "Kids" | "Accessories" | "Other";

type ApiSubCategory =
  | "Shirts" | "Pants" | "Dresses" | "Shoes" | "Jackets" | "Hoodies"
  | "Jeans" | "Shorts" | "T-Shirts" | "Sweaters" | "Coats" | "Bags"
  | "Hats" | "Other";

interface ApiPromotion {
  active?: boolean;
  type?: "percentage" | "amount";
  value?: number;
  startDate?: string | null;
  endDate?: string | null;
}

interface ApiVariant {
  _id: string;
  size: string;
  color: string;
  stock: number;
  sku?: string;
}

interface ApiProduct {
  _id: string;
  sellerId: string;
  name: string;
  brand: string;
  images: ApiImageObject[];
  price: number;
  inStock: boolean;
  totalStock: number;
  description: string;
  sizes: string[];
  colors: string[];
  variants: ApiVariant[];
  mainCategory: ApiCategory;
  subCategory: ApiSubCategory;
  promotion?: ApiPromotion;
  createdAt: string;
  updatedAt: string;
}

interface ApiReview {
  _id: string;
  customerId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiProductReviewCustomer {
  _id: string;
  fullName: string;
}

interface ApiProductReview {
  _id: string;
  customerId: ApiProductReviewCustomer;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiProductShareResponse {
  message: string;
  share: {
    productUrl: string;
    platforms: {
      whatsapp: string;
      facebook: string;
      telegram: string;
      instagram: string;
    };
  };
}

// ─── Traffic Analytics ──────────────────────────────────────────────────
type TrafficSource = "instagram" | "tiktok" | "whatsapp" | "facebook" | "foda";

interface TrafficSourceCount {
  source: TrafficSource;
  visits: number;
  percentage: number;
}

interface TrafficTrendPoint {
  date: string; // YYYY-MM-DD
  visits: number;
}

interface TrafficOverview {
  range: { from: string; to: string };
  productId: string | null;
  totalVisits: number;
  totalOrders: number;
  conversionRate: number;
  topSource: TrafficSource | null;
  bySource: TrafficSourceCount[];
  trend: TrafficTrendPoint[];
}

interface TrafficSourceRow {
  source: TrafficSource;
  visits: number;
  percentage: number;
  trend: TrafficTrendPoint[];
}

// ─── Cart ───────────────────────────────────────────────────────────────
interface ApiCartItem {
  productId: string;
  sellerId: string;
  variantId: string;
  name: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  image: string;
  selectedChoices: { size: string; color: string };
}

interface ApiCart {
  _id: string;
  customerId: string;
  items: ApiCartItem[];
  totalPrice: number;
}

// ─── Shipping & Orders ────────────────────────────────────────────────
interface ApiShippingDetails {
  phone: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  shippingType: "home_delivery" | "desk_pickup";
  shippingFee?: number;
}

type ApiOrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface ApiOrderCustomer {
  _id: string;
  fullName: string;
  email: string;
}

interface ApiOrder {
  _id: string;
  customerId: string | ApiOrderCustomer;
  sellerId: string;
  items: ApiCartItem[];
  shippingDetails: ApiShippingDetails;
  status: ApiOrderStatus;
  totalAmount: number;
  tracking_id?: string;
  managedBy?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Confirmator ────────────────────────────────────────────────────────
interface ApiConfirmator {
  _id: string;
  email: string;
  fullName: string;
  phoneNumber?: number | null;
  isActive: boolean;
  confirmedOrders: number;
  cancelledOrders: number;
  createdAt: string;
}

// ─── Seller Settings ────────────────────────────────────────────────────
interface ApiSellerSettingsResponse {
  message: string;
  seller: {
    id: string;
    shopName: string;
    email: string;
    phone: number | null;
    address: { wilaya: string; commune: string } | null;
    logoUrl: string | null;
  };
}

interface ApiCheckoutResponse {
  message: string;
  orders: ApiOrder[];
}

// ─── Shipping Fees ──────────────────────────────────────────────────────
interface ApiCheckoutShippingFeeItem {
  wilaya_id: number;
  wilaya_name: string | null;
  commune_id: number | null;
  commune_name: string | null;
  fees: { home?: number; desk?: number; return?: number };
}

interface ApiCheckoutShippingFeesResponse {
  shippingFees: {
    meta?: {
      company_id?: number;
      company_name?: string;
      company_code?: string;
      sub_provider?: string;
      api_code?: string;
      provider_enum?: string;
      timestamp?: string;
    };
    data: ApiCheckoutShippingFeeItem[];
    status: string;
  };
}

// ─── Customer Profile ───────────────────────────────────────────────────
interface ApiCustomerProfile {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: "customer";
  shippingAddress: string | null;
  wishlist: string[];
  isVerified: boolean;
  imageUrl: ApiImageObject | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Delivery Companies ─────────────────────────────────────────────────
interface ApiDeliveryCompany {
  name: string;
  api_code: string;
  company_code: string;
  logo: string;
}

interface ApiDeliveryCompaniesResponse {
  companies: ApiDeliveryCompany[];
}

interface ApiCompleteSellerSetupPayload {
  wilaya: string;
  commune: string;
  deliveryCompany: string;
  seller_delivery_token: string;
}

interface ApiCompleteSellerSetupResponse {
  message: string;
  seller: {
    _id: string;
    shopName: string;
    email: string;
    address: { wilaya: string; commune: string };
    company_code: string;
    connection_label: string;
  };
}

// ─── Collections ────────────────────────────────────────────────────────
interface ApiCollectionProduct {
  _id: string;
  name: string;
  brand?: string;
  images: ApiImageObject[];
  price: number;
  totalStock: number;
  inStock: boolean;
}

interface ApiCollection {
  _id: string;
  sellerId: string;
  name: string;
  description?: string;
  coverImage?: ApiImageObject;
  products: string[] | ApiCollectionProduct[];
  createdAt: string;
  updatedAt: string;
}

// ─── Seller Storefront (public) ─────────────────────────────────────────
interface ApiSellerProfile {
  id: string;
  shopName: string;
  logoUrl: string | null;
  phone: number | null;
  address: { wilaya: string; commune: string } | null;
  isVerified: boolean;
  verifiedBadge: boolean;
  memberSince: string;
  productCount: number;
  followers: number;
  isFollowing: boolean;
}

// ─── Meta Ads ───────────────────────────────────────────────────────────
interface ApiMetaAdsEvent {
  _id: string;
  sellerId: string;
  eventName: string;
  eventId?: string;
  eventTime: string;
  eventSourceUrl?: string;
  actionSource?: string;
  userData?: unknown;
  customData?: unknown;
  forwardStatus: "stored" | "forwarded" | "failed";
  forwardError?: string;
  isTestEvent?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## 16. Mongoose Models

Source of truth for field names/types on the backend; response shapes above are derived (and sometimes trimmed) from these.

### Customer
```ts
{
  fullName: string;
  email: string;               // unique
  phoneNumber: string | null;
  password?: string;           // required only if authProvider === 'local'
  googleId?: string;
  facebookId?: string;
  authProvider: "local" | "google" | "facebook";
  role: "customer" | "admin";
  shippingAddress?: string;
  wishlist: string[];          // product IDs
  followedSellers: string[];   // seller IDs
  isVerified: boolean;
  verificationCode?: number;
  imageUrl?: { url: string; publicId: string };
  createdAt: Date;
  updatedAt: Date;
}
```

### Seller
```ts
{
  shopName: string;            // unique
  phone?: number;
  email: string;                // unique
  password?: string;           // required only if local
  googleId?: string;
  facebookId?: string;
  authProvider: "local" | "google" | "facebook";
  role: string;                 // default "seller"
  verifiedBadge: boolean;
  followers: number;
  rating: number;
  address: { wilaya: string; commune: string };
  logoUrl: { url: string; publicId: string } | null;
  verificationCode?: number;
  isVerified: boolean;
  isActive: boolean;
  company_code?: string;
  connection_label?: string;
  metaAds: {
    isConnected: boolean;
    adAccountId?: string;
    adAccountName?: string;
    pixelId?: string;
    pageId?: string;
    businessId?: string;
    accessToken?: string;      // encrypted at rest, never exposed to clients
    currency: string | null;
    connectedAt?: Date;
    lastSyncedAt: Date | null;
    trackingKey: string | null;
    oauthState: string | null;
    oauthStateExpiresAt: Date | null;
    insights: {
      datePreset?: string;
      impressions: number;
      clicks: number;
      spend: number;
      reach: number;
      ctr: number;
      cpc: number;
      purchases: number;
      conversions: number;
      roas: number;
      currency?: string;
    } | null;
    campaigns: { campaignId: string; name: string; status: string; objective?: string; effectiveStatus?: string }[];
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Product
```ts
{
  sellerId: ObjectId;          // ref Seller
  name: string;
  brand: string;
  images: { url: string; publicId: string }[];
  price: number;                // ≥ 0
  description?: string;
  sizes: string[];
  colors: string[];
  variants: { _id: string; size: string; color: string; stock: number; sku?: string }[];
  totalStock: number;          // auto-computed from sum of variant stocks (pre-save hook)
  inStock: boolean;             // auto = totalStock > 0
  promotion: {
    active: boolean;
    type: "percentage" | "amount";
    value: number;
    code: string | null;
    startDate?: Date;
    endDate?: Date;
  };
  mainCategory: "Men" | "Women" | "Kids" | "Accessories" | "Other";
  subCategory: "Shirts" | "Pants" | "Dresses" | "Shoes" | "Jackets" | "Hoodies"
             | "Jeans" | "Shorts" | "T-Shirts" | "Sweaters" | "Coats" | "Bags"
             | "Hats" | "Other";
  createdAt: Date;
  updatedAt: Date;
}
```
> The pre-save hook rebuilds `variants` as the full cross-product of `sizes × colors`, preserving `stock`/`sku` for pairs that still exist. There is a text index on `name` + `description` used by `GET /products?search=`.

### Order
```ts
{
  customerId: ObjectId;        // ref Customer
  sellerId: ObjectId;          // ref Seller
  items: {
    productId: ObjectId;
    variantId: string;
    name: string;
    quantity: number;           // default 1
    price: number;
    originalPrice?: number;
    image?: string;
    selectedChoices: { size: string; color: string };
  }[];
  shippingDetails: {
    phone: string;
    wilaya: string;
    commune: string;
    postalCode?: string;
    shippingType: "home_delivery" | "desk_pickup";
    shippingFee: number;       // default 0
  };
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  tracking_id?: string;
  managedBy?: string;
  reason?: string;              // default ""
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart
```ts
{
  customerId: ObjectId;        // ref Customer, unique — one cart per customer
  items: {
    productId: ObjectId;
    sellerId: ObjectId;
    variantId: string;
    name: string;
    quantity: number;           // default 1
    price: number;
    originalPrice?: number;
    image?: string;
    selectedChoices: { color: string; size: string };
  }[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Review
```ts
{
  customerId: ObjectId;        // ref Customer
  productId: ObjectId;         // ref Product
  rating: number;                // 1–5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection
```ts
{
  sellerId: ObjectId;          // ref Seller
  name: string;                  // max 100 chars
  description?: string;         // max 500 chars
  coverImage?: { url: string; publicId: string };
  products: ObjectId[];         // ref Product
  createdAt: Date;
  updatedAt: Date;
}
```

### Confirmator
```ts
{
  sellerId: string;              // ref Seller
  email: string;
  fullName: string;
  phoneNumber?: number;
  isActive: boolean;
  accessToken: string;          // long-lived (365d) JWT used as login credential
  role: "confirmator";
  confirmedOrders: number;
  cancelledOrders: number;
}
```

### DeliveryCompany
```ts
{
  name: string;
  api_code: string;
  company_code: string;
  logo: string;
}
```

### MetaAdsEvent
```ts
{
  sellerId: ObjectId;          // ref Seller
  eventName: string;
  eventId?: string;
  eventTime: Date;
  eventSourceUrl?: string;
  actionSource?: string;
  userData?: unknown;
  customData?: unknown;
  rawPayload: unknown;
  forwardStatus: "stored" | "forwarded" | "failed";
  forwardError?: string;
  metaResponse?: unknown;
  isTestEvent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### ProductVisit
```ts
{
  sellerId: ObjectId;          // ref Seller
  productId: ObjectId;         // ref Product
  source: "instagram" | "tiktok" | "whatsapp" | "facebook" | "foda";
  visitorId?: string;
  deviceType?: "mobile" | "desktop" | "tablet";
  referrer?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 17. External Integrations

| Service | Used for |
|---|---|
| **Dolivroo** | Shipping-fee quotes (`GET /cart/checkout/shipping-fees`), delivery order creation on order confirm, shipping label PDF download. Upstream failures surface to clients as `502`. |
| **Cloudinary** | All image uploads (product images, seller logo, customer avatar, collection cover) — via Multer + `multer-storage-cloudinary`. Response `url`/`publicId` are Cloudinary's. |
| **Meta (Facebook) Graph API** | Full OAuth + Conversions API integration under `/seller/meta-ads/*`. |
| **Google / Facebook OAuth** | Social login for customers and sellers (`/auth/google*`, `/auth/facebook*`). |

---

## Notes on notable route quirks (for accurate integration)

- `GET /customer/profile` returns the customer document **directly**, not nested under a `customer` key — different from most other endpoints.
- `GET /seller/collections` (list) returns `{ collections, total, page, limit, totalPages }` at the top level — not nested under a `data` or `result` key.
- Seller shape differs slightly between `/auth/verify` (`imageUrl`, no `isActive`) and `/auth/login` (`logoUrl`, `isActive`) responses — both are documented separately in [§2](#2-auth--apiv1auth).
- There is **no** standalone `/api/v1/orders` resource — order management is entirely split across `/seller/orders`, `/customer/orders`, and `/confirmator/orders`.
- `POST /products/:id/visit` intentionally returns `204 No Content` — do not expect a JSON body.
- `POST /seller/meta-ads/events` is the only **public** (unauthenticated) route under `/seller/meta-ads/*` — it authenticates via the per-seller `trackingKey` in the body instead of a JWT.
