# System Architecture Diagram
## GhanaTech Store - Cloud Architecture

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GHANATECH STORE ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────┐
                              │     END USERS       │
                              │  (Web Browsers)     │
                              │  Mobile / Desktop   │
                              └──────────┬──────────┘
                                         │
                                         │ HTTPS
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CDN / EDGE NETWORK                                  │
│                                  (Vercel Edge)                                   │
│                         Static Assets | Image Optimization                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                        │
                    ▼                                        ▼
┌───────────────────────────────────┐    ┌───────────────────────────────────────┐
│         FRONTEND (Vercel)         │    │           BACKEND (Render)            │
│  ┌─────────────────────────────┐  │    │  ┌─────────────────────────────────┐  │
│  │       Next.js 14 App        │  │    │  │       Node.js + Express         │  │
│  │                             │  │    │  │                                 │  │
│  │  ┌──────┐ ┌──────┐ ┌─────┐ │  │    │  │  ┌────────┐  ┌──────────────┐  │  │
│  │  │Pages │ │ API  │ │State│ │  │    │  │  │ Routes │  │ Controllers  │  │  │
│  │  │(SSR) │ │Client│ │Mgmt │ │  │    │  │  │        │  │              │  │  │
│  │  └──────┘ └──────┘ └─────┘ │  │    │  │  └────────┘  └──────────────┘  │  │
│  │                             │  │    │  │                                 │  │
│  │  ┌──────────────────────┐  │  │    │  │  ┌──────────────────────────┐  │  │
│  │  │    Tailwind CSS      │  │  │    │  │  │     Middleware           │  │  │
│  │  │    (Styling)         │  │  │    │  │  │  - Auth (JWT)            │  │  │
│  │  └──────────────────────┘  │  │    │  │  │  - Error Handler         │  │  │
│  │                             │  │    │  │  │  - CORS                  │  │  │
│  │  ┌──────────────────────┐  │  │    │  │  └──────────────────────────┘  │  │
│  │  │   React Context      │  │  │    │  │                                 │  │
│  │  │  - AuthContext       │  │  │    │  │  ┌──────────────────────────┐  │  │
│  │  │  - CartContext       │  │  │    │  │  │     Services             │  │  │
│  │  └──────────────────────┘  │  │    │  │  │  - Paystack              │  │  │
│  └─────────────────────────────┘  │    │  │  │  - Email (future)       │  │  │
│                                   │    │  │  └──────────────────────────┘  │  │
│  URL: ghanatech.vercel.app        │    │  └─────────────────────────────────┘  │
└───────────────────────────────────┘    │                                       │
                    │                    │  URL: ghanatech-api.onrender.com      │
                    │                    └───────────────────┬───────────────────┘
                    │                                        │
                    │           REST API (JSON)              │
                    └────────────────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                        │
                    ▼                                        ▼
┌───────────────────────────────────┐    ┌───────────────────────────────────────┐
│       DATABASE (MongoDB Atlas)    │    │         PAYMENT (Paystack)            │
│  ┌─────────────────────────────┐  │    │  ┌─────────────────────────────────┐  │
│  │    MongoDB Cluster          │  │    │  │    Payment Gateway              │  │
│  │                             │  │    │  │                                 │  │
│  │  ┌────────┐ ┌────────────┐ │  │    │  │  ┌─────────────────────────┐   │  │
│  │  │ Users  │ │  Products  │ │  │    │  │  │   Channels Supported    │   │  │
│  │  └────────┘ └────────────┘ │  │    │  │  │   - MTN Mobile Money    │   │  │
│  │  ┌────────┐ ┌────────────┐ │  │    │  │  │   - Vodafone Cash       │   │  │
│  │  │ Orders │ │   Carts    │ │  │    │  │  │   - AirtelTigo Money    │   │  │
│  │  └────────┘ └────────────┘ │  │    │  │  │   - Credit/Debit Cards  │   │  │
│  │                             │  │    │  │  └─────────────────────────┘   │  │
│  │  Region: AWS (eu-west-1)   │  │    │  │                                 │  │
│  └─────────────────────────────┘  │    │  │  URL: api.paystack.co          │  │
│                                   │    │  └─────────────────────────────────┘  │
│  Connection: mongodb+srv://...    │    │                                       │
└───────────────────────────────────┘    └───────────────────────────────────────┘
```

---

## Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND ARCHITECTURE (Next.js)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  src/                                                                           │
│  ├── app/                         # App Router (Pages)                         │
│  │   ├── page.tsx                 # Homepage                                   │
│  │   ├── products/                # Product listing & details                  │
│  │   ├── cart/                    # Shopping cart                              │
│  │   ├── checkout/                # Checkout flow                              │
│  │   ├── orders/                  # Order history                              │
│  │   ├── admin/                   # Admin dashboard                            │
│  │   │   ├── page.tsx             # Dashboard stats                            │
│  │   │   ├── products/            # Product management                         │
│  │   │   ├── orders/              # Order management                           │
│  │   │   └── users/               # User management                            │
│  │   ├── login/                   # Login page                                 │
│  │   └── register/                # Registration page                          │
│  │                                                                             │
│  ├── components/                  # Reusable UI Components                     │
│  │   ├── ui/                      # Base components (Button, Input, etc.)      │
│  │   ├── layout/                  # Navbar, Footer, Layout                     │
│  │   ├── products/                # ProductCard, ProductList                   │
│  │   └── cart/                    # CartItem, CartSummary                      │
│  │                                                                             │
│  ├── context/                     # React Context (State Management)           │
│  │   ├── AuthContext.tsx          # User authentication state                  │
│  │   └── CartContext.tsx          # Shopping cart state                        │
│  │                                                                             │
│  ├── lib/                         # Utilities & API Client                     │
│  │   ├── api/                     # Axios API calls                            │
│  │   │   ├── auth.ts              # Authentication endpoints                   │
│  │   │   ├── products.ts          # Product endpoints                          │
│  │   │   ├── cart.ts              # Cart endpoints                             │
│  │   │   ├── orders.ts            # Order endpoints                            │
│  │   │   └── payments.ts          # Payment endpoints                          │
│  │   └── utils.ts                 # Helper functions                           │
│  │                                                                             │
│  └── types/                       # TypeScript type definitions                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND ARCHITECTURE (Express)                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  src/                                                                           │
│  ├── server.js                    # Entry point, server config                 │
│  │                                                                             │
│  ├── config/                      # Configuration                              │
│  │   └── db.js                    # MongoDB connection                         │
│  │                                                                             │
│  ├── models/                      # Mongoose Models                            │
│  │   ├── User.js                  # User schema                                │
│  │   ├── Product.js               # Product schema                             │
│  │   ├── Order.js                 # Order schema                               │
│  │   └── Cart.js                  # Cart schema                                │
│  │                                                                             │
│  ├── routes/                      # API Routes                                 │
│  │   ├── authRoutes.js            # /api/v1/auth/*                            │
│  │   ├── productRoutes.js         # /api/v1/products/*                        │
│  │   ├── cartRoutes.js            # /api/v1/cart/*                            │
│  │   ├── orderRoutes.js           # /api/v1/orders/*                          │
│  │   ├── paymentRoutes.js         # /api/v1/payments/*                        │
│  │   └── adminRoutes.js           # /api/v1/admin/*                           │
│  │                                                                             │
│  ├── controllers/                 # Route Handlers                             │
│  │   ├── authController.js        # Register, Login, GetMe                     │
│  │   ├── productController.js     # CRUD for products                          │
│  │   ├── cartController.js        # Cart operations                            │
│  │   ├── orderController.js       # Order management                           │
│  │   ├── paymentController.js     # Payment initialization/verification        │
│  │   └── adminController.js       # Admin operations                           │
│  │                                                                             │
│  ├── middleware/                  # Express Middleware                         │
│  │   ├── auth.js                  # JWT verification, protect routes           │
│  │   └── errorHandler.js          # Global error handling                      │
│  │                                                                             │
│  ├── services/                    # External Services                          │
│  │   └── paystack.js              # Paystack API integration                   │
│  │                                                                             │
│  └── utils/                       # Utilities                                  │
│      └── seeder.js                # Database seeding                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA FLOW DIAGRAM                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

USER ACTION                    FRONTEND                BACKEND                DATABASE
    │                             │                       │                       │
    │  1. Browse Products         │                       │                       │
    ├────────────────────────────►│                       │                       │
    │                             │  GET /products        │                       │
    │                             ├──────────────────────►│                       │
    │                             │                       │  db.products.find()   │
    │                             │                       ├──────────────────────►│
    │                             │                       │◄──────────────────────┤
    │                             │◄──────────────────────┤  Product[]            │
    │◄────────────────────────────┤  Render product list  │                       │
    │                             │                       │                       │
    │  2. Add to Cart             │                       │                       │
    ├────────────────────────────►│                       │                       │
    │                             │  POST /cart           │                       │
    │                             │  {productId, qty}     │                       │
    │                             ├──────────────────────►│                       │
    │                             │                       │  Update cart          │
    │                             │                       ├──────────────────────►│
    │                             │                       │◄──────────────────────┤
    │                             │◄──────────────────────┤  Updated cart         │
    │◄────────────────────────────┤  Update CartContext   │                       │
    │                             │                       │                       │
    │  3. Checkout (MoMo)         │                       │                       │
    ├────────────────────────────►│                       │                       │
    │                             │  POST /orders         │                       │
    │                             ├──────────────────────►│                       │
    │                             │                       │  Create order         │
    │                             │                       ├──────────────────────►│
    │                             │                       │                       │
    │                             │  POST /payments/init  │                       │
    │                             ├──────────────────────►│                       │
    │                             │                       │                       │
    │                             │                       │  ┌─────────────────┐  │
    │                             │                       │  │    PAYSTACK     │  │
    │                             │                       ├─►│   Initialize    │  │
    │                             │                       │  │   Transaction   │  │
    │                             │                       │◄─┤                 │  │
    │                             │                       │  └─────────────────┘  │
    │                             │◄──────────────────────┤  auth_url             │
    │                             │                       │                       │
    │◄────────────────────────────┤  Redirect to Paystack │                       │
    │                             │                       │                       │
    │  4. Complete Payment        │                       │                       │
    │  (On Paystack page)         │                       │                       │
    ├─────────────────────────────────────────────────────┼──────────────────────►│
    │                             │                       │  ┌─────────────────┐  │
    │                             │                       │  │    PAYSTACK     │  │
    │                             │                       │  │    Payment      │  │
    │                             │                       │  │    Processing   │  │
    │◄─────────────────────────────────────────────────────────────────────────────┤
    │  Redirect back with ref     │                       │  └─────────────────┘  │
    │                             │                       │                       │
    │  5. Verify Payment          │                       │                       │
    ├────────────────────────────►│                       │                       │
    │                             │  GET /payments/verify │                       │
    │                             ├──────────────────────►│                       │
    │                             │                       │  ┌─────────────────┐  │
    │                             │                       ├─►│    PAYSTACK     │  │
    │                             │                       │  │    Verify       │  │
    │                             │                       │◄─┤                 │  │
    │                             │                       │  └─────────────────┘  │
    │                             │                       │                       │
    │                             │                       │  Update order status  │
    │                             │                       ├──────────────────────►│
    │                             │◄──────────────────────┤                       │
    │◄────────────────────────────┤  Order confirmed!     │                       │
    │                             │                       │                       │
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AUTHENTICATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. REGISTRATION                                                                │
│     ┌────────┐      ┌──────────────┐      ┌─────────────┐      ┌────────────┐  │
│     │ Client │─────►│  Validate    │─────►│  Hash Pass  │─────►│ Create     │  │
│     │        │      │  Input       │      │  (bcrypt)   │      │ User       │  │
│     └────────┘      └──────────────┘      └─────────────┘      └────────────┘  │
│                                                                                 │
│  2. LOGIN                                                                       │
│     ┌────────┐      ┌──────────────┐      ┌─────────────┐      ┌────────────┐  │
│     │ Client │─────►│ Find User    │─────►│ Compare     │─────►│ Generate   │  │
│     │        │      │ by Email     │      │ Password    │      │ JWT Token  │  │
│     └────────┘      └──────────────┘      └─────────────┘      └────────────┘  │
│                                                                                 │
│  3. PROTECTED ROUTES                                                            │
│     ┌────────┐      ┌──────────────┐      ┌─────────────┐      ┌────────────┐  │
│     │Request │─────►│ Extract      │─────►│ Verify JWT  │─────►│ Attach     │  │
│     │+ Token │      │ Bearer Token │      │ Signature   │      │ User to Req│  │
│     └────────┘      └──────────────┘      └─────────────┘      └────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY MEASURES                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │   PASSWORD      │  │    JWT          │  │    CORS         │                 │
│  │   HASHING       │  │    TOKENS       │  │    CONFIG       │                 │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                 │
│  │ bcrypt with     │  │ Secret key      │  │ Whitelist       │                 │
│  │ salt rounds: 12 │  │ in env vars     │  │ frontend URL    │                 │
│  │                 │  │ Expires: 7 days │  │ only            │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │    HTTPS        │  │   ENV VARS      │  │   VALIDATION    │                 │
│  │    ONLY         │  │   SECRETS       │  │   SANITIZATION  │                 │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤                 │
│  │ SSL/TLS via     │  │ API keys in     │  │ Input validated │                 │
│  │ Vercel/Render   │  │ environment     │  │ before use      │                 │
│  │                 │  │ Never in code   │  │                 │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD DEPLOYMENT PIPELINE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │  Developer  │
  │   Machine   │
  └──────┬──────┘
         │
         │  git push
         ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │                         GITHUB                                   │
  │  ┌─────────────────────────────────────────────────────────┐    │
  │  │  Repository: ca_[index_number]                          │    │
  │  │                                                         │    │
  │  │  ┌──────────────┐    ┌──────────────┐                  │    │
  │  │  │ ghanatech-   │    │ ghanatech-   │                  │    │
  │  │  │ frontend/    │    │ backend/     │                  │    │
  │  │  └──────────────┘    └──────────────┘                  │    │
  │  └─────────────────────────────────────────────────────────┘    │
  │                              │                                   │
  │                              │ Triggers GitHub Actions           │
  │                              ▼                                   │
  │  ┌─────────────────────────────────────────────────────────┐    │
  │  │                    GITHUB ACTIONS                        │    │
  │  │                                                         │    │
  │  │  on: push to main                                       │    │
  │  │                                                         │    │
  │  │  Jobs:                                                  │    │
  │  │  ┌─────────────────┐    ┌─────────────────┐            │    │
  │  │  │ deploy-frontend │    │ deploy-backend  │            │    │
  │  │  │                 │    │                 │            │    │
  │  │  │ - npm install   │    │ - curl webhook  │            │    │
  │  │  │ - npm run build │    │   to Render     │            │    │
  │  │  │ - vercel deploy │    │                 │            │    │
  │  │  └────────┬────────┘    └────────┬────────┘            │    │
  │  │           │                      │                      │    │
  │  └───────────┼──────────────────────┼──────────────────────┘    │
  └──────────────┼──────────────────────┼───────────────────────────┘
                 │                      │
                 ▼                      ▼
  ┌─────────────────────┐    ┌─────────────────────┐
  │       VERCEL        │    │       RENDER        │
  │  ┌───────────────┐  │    │  ┌───────────────┐  │
  │  │   Frontend    │  │    │  │    Backend    │  │
  │  │   (Next.js)   │  │    │  │   (Express)   │  │
  │  │               │  │    │  │               │  │
  │  │  Edge Network │  │    │  │  Web Service  │  │
  │  │  SSL/HTTPS    │  │    │  │  SSL/HTTPS    │  │
  │  │  CDN Caching  │  │    │  │  Auto-scaling │  │
  │  └───────────────┘  │    │  └───────────────┘  │
  │                     │    │                     │
  │  ghanatech.vercel.app    │  ghanatech-api.onrender.com
  └─────────────────────┘    └─────────────────────┘
                 │                      │
                 │                      │
                 └──────────┬───────────┘
                            │
                            ▼
               ┌─────────────────────────┐
               │     MONGODB ATLAS       │
               │  ┌───────────────────┐  │
               │  │   Cloud Database  │  │
               │  │                   │  │
               │  │  Cluster: M0 Free │  │
               │  │  Region: AWS      │  │
               │  │  Backup: Yes      │  │
               │  └───────────────────┘  │
               └─────────────────────────┘
```

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | Next.js | 14.x | React with SSR/SSG |
| UI Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State Management | React Context | - | Client-side state |
| HTTP Client | Axios | 1.x | API requests |
| Backend Framework | Express | 4.x | REST API server |
| Runtime | Node.js | 20.x | JavaScript runtime |
| Database | MongoDB | 7.x | NoSQL database |
| ODM | Mongoose | 9.x | MongoDB object modeling |
| Authentication | JWT + bcrypt | - | Stateless auth |
| Payment Gateway | Paystack | - | Mobile Money + Cards |
| Frontend Hosting | Vercel | - | Edge deployment |
| Backend Hosting | Render | - | Cloud platform |
| Database Hosting | MongoDB Atlas | - | Managed MongoDB |
| Version Control | Git + GitHub | - | Source control |
| CI/CD | GitHub Actions | - | Automated deployment |

---

*System Architecture for GhanaTech Store - CS/IT4131 Cloud Applications*
