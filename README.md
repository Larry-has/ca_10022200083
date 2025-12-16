# GhanaTech Store - E-Commerce Platform

**Student Name:** Lawrence Effah
**Index Number:** 10022200083
**Course:** CS/IT4131 - Cloud Applications
**Semester:** First Semester 2025/2026

---

A full-stack e-commerce platform built with Next.js 14 and Node.js/Express, deployed on cloud infrastructure.

## Live Demo

- **Frontend:** https://ca10022200083.netlify.app
- **Backend API:** https://cataazinbackend.onrender.com

## Documentation

All project documentation is available in the `/docs` folder:
- [Project Documentation Report (PDR)](./docs/PROJECT_DOCUMENTATION_REPORT.md)
- [ERD Diagram](./docs/ERD_DIAGRAM.md)
- [Use Case Diagrams](./docs/USE_CASE_DIAGRAMS.md)
- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)

## Tech Stack

- **Next.js 14** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

3. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home page
- `/products` - Products listing
- `/products/[id]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/orders` - Order history
- `/login` - Login
- `/register` - Registration
- `/admin` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/orders` - Manage orders

## Features

- User authentication (JWT)
- Product browsing with filters
- Shopping cart
- Checkout with multiple payment methods
- Order tracking
- Admin dashboard
- Mobile Money payment (Ghana-specific)
- Responsive design

## Ghana-Specific Features

- Ghana Cedis (GHS) currency
- All 16 regions for shipping
- Ghana Post GPS address support
- Mobile Money integration (MTN MoMo, Vodafone Cash, AirtelTigo Money)
- Ghana phone number validation

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
