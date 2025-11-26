# E‑Commerce Core (Next.js, MongoDB-ready)

Minimal e‑commerce foundation (Shopify-like) with:
- Next.js app router (no TypeScript)
- JWT auth (httpOnly cookies), role-based (User/Admin)
- Product CRUD, search, pagination
- Cart with item update/removal
- Mock checkout + order creation with stock validation (Mongo transaction)
- Admin console (dashboard, products CRUD, orders)
- Coupons, monthly sales analytics
- Cloudinary signed upload helper

Note: No DB URI is hardcoded. Set `MONGODB_URI` in `.env` (use your link).

## Quick Start (Windows PowerShell)

1) Create `.env` from example and fill values:

```powershell
Copy-Item .env.example .env
notepad .env
```

Required:
- `MONGODB_URI` (e.g. your link: `mongodb+srv://root:root@cluster0.aca27.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0`)
- `JWT_SECRET` (any strong string)
- Optional Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

2) Install deps and run dev:

```powershell
npm install
npm run dev
```

Open http://localhost:3000

## First Admin
The first registered user becomes `admin`. Register via `/register`, then login.

## API Overview
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET /api/products` (search: `?q=&category=&page=&limit=`), `POST /api/products` (admin)
- `GET /api/products/:id`, `PUT/DELETE /api/products/:id` (admin)
- `GET/POST/PUT/DELETE /api/cart` (user)
- `POST /api/orders` (user), `GET /api/orders` (admin), `GET /api/orders/:id` (owner/admin)
- `POST /api/payment/simulate` (mock success)
- `GET/POST /api/categories` (admin for POST)
- `GET /api/coupons?code=CODE` validate; `GET /api/coupons` list (admin); `POST /api/coupons` (admin)
- `GET /api/analytics/monthly-sales` (admin)
- `GET /api/upload` (Cloudinary signature)

## Frontend Pages
- `/` product listing with pagination
- `/product/[id]` details + add to cart
- `/cart` update/remove items
- `/checkout` mock payment -> order
- `/order/[id]` confirmation
- `/login`, `/register`
- `/admin/login`, `/admin` dashboard, `/admin/products`, `/admin/products/new`, `/admin/products/[id]`, `/admin/orders`

## Notes
- Uses Mongo transactions for order creation (Atlas/replica set required).
- Image upload: either paste an image URL or use Cloudinary via `/api/upload`.
- For deployment, set `NEXT_PUBLIC_BASE_URL` to your site origin if needed for server fetches.
