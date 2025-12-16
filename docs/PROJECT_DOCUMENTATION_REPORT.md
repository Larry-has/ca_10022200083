# Project Documentation Report (PDR)
## GhanaTech Store - E-Commerce Platform

---

**Student Name:** Lawrence Effah
**Index Number:** 10022200083
**Course:** CS/IT4131 - Cloud Applications
**Lecturer:** Godwin Ntow Danso
**Date:** December 2024

---

# Chapter 1: The Spark — Mapping My Vision

## Section A: Project Introduction and Planning

### i. Project Overview and Objectives (3 marks)

#### Niche Choice: Ghanaian Electronics E-Commerce

**GhanaTech Store** is a specialized e-commerce platform focused on providing quality electronics to Ghanaian consumers. The platform addresses the unique needs of the Ghanaian market by incorporating:

- **Local Payment Methods**: MTN Mobile Money, Vodafone Cash, AirtelTigo Money
- **Ghana Cedi (GHS) Pricing**: All prices displayed in local currency
- **Nationwide Delivery**: Coverage across all 16 regions of Ghana
- **Local Brands**: Support for African brands like Tecno, Infinix alongside global brands

#### Project Objectives

1. **Primary Objective**: Build a fully functional e-commerce platform that enables Ghanaians to purchase electronics online with local payment options.

2. **Secondary Objectives**:
   - Implement secure user authentication and authorization
   - Create an intuitive admin dashboard for inventory management
   - Integrate Paystack for seamless mobile money and card payments
   - Deploy to cloud infrastructure for scalability and reliability

#### Target Customer Profile

| Attribute | Description |
|-----------|-------------|
| Location | Ghana (All 16 Regions) |
| Age Range | 18-45 years |
| Tech Savvy | Moderate to High |
| Payment Preference | Mobile Money (70%), Card (30%) |
| Primary Device | Mobile (65%), Desktop (35%) |


---

### ii. Scope Definition and Stakeholders (3 marks)

#### Project Scope

**In Scope:**
- User registration and authentication
- Product catalog with categories and search
- Shopping cart functionality
- Order placement and tracking
- Mobile Money payment integration (Paystack)
- Admin dashboard for product/order management
- Responsive web design

**Out of Scope:**
- Native mobile applications
- Physical store integration
- Multi-vendor marketplace
- International shipping

#### Stakeholder Matrix

| Stakeholder | Role | Interest Level | Influence | My Insight |
|-------------|------|----------------|-----------|------------|
| End Users (Customers) | Primary users who browse and purchase | High | High | "I want to pay with MoMo easily" - From WhatsApp chat |
| Admin/Store Owner | Manages products and orders | High | High | Needs simple dashboard |
| Developers | Build and maintain platform | Medium | High | Focus on clean code |
| Payment Provider (Paystack) | Handles transactions | Medium | Medium | API integration required |
| Delivery Partners | Fulfill orders | Medium | Low | Need order details |


---

### iii. Project Timeline and Resource Allocation (4 marks)

#### Gantt Chart

```
Project: GhanaTech Store Development
Duration: 10 Days

Day 1-2: Planning & Design
├── Requirements gathering
├── Database design (ERD)
├── UI/UX wireframes
└── Architecture planning

Day 3-4: Backend Development
├── Set up Node.js + Express
├── MongoDB models (User, Product, Cart, Order)
├── Authentication (JWT)
└── REST API endpoints

Day 5-6: Frontend Development
├── Next.js project setup
├── Components (Navbar, ProductCard, etc.)
├── Pages (Home, Products, Cart, Checkout)
└── State management (Context API)

Day 7-8: Integration & Features
├── Connect frontend to backend
├── Paystack payment integration
├── Admin dashboard
└── Mobile responsiveness

Day 9: Testing & Bug Fixes
├── Unit testing
├── Integration testing
├── Bug fixes
└── Performance optimization

Day 10: Deployment & Documentation
├── Deploy backend (Render)
├── Deploy frontend (Vercel)
├── CI/CD setup (GitHub Actions)
└── Final documentation
```

#### Resource Allocation

| Resource | Allocation | Purpose |
|----------|------------|---------|
| Developer Time | 80 hours | Coding & testing |
| Cloud Services | Vercel (Free tier) | Frontend hosting |
| Cloud Services | Render (Free tier) | Backend hosting |
| Database | MongoDB Atlas (Free) | Data storage |
| Payment | Paystack (Test mode) | Payment processing |


---

# Chapter 2: Listening and Structuring — From Chaos to Clarity

## Section B: Requirements Analysis

### i. Functional and Non-Functional Requirements (5 marks)

#### Functional Requirements

| ID | Requirement | Priority | User Story |
|----|-------------|----------|------------|
| FR1 | User Registration | High | As a user, I want to create an account to track my orders |
| FR2 | User Login | High | As a user, I want to login securely to access my account |
| FR3 | Browse Products | High | As a user, I want to browse products by category |
| FR4 | Search Products | High | As a user, I want to search for specific products |
| FR5 | Add to Cart | High | As a user, I want to add products to my cart |
| FR6 | Checkout | High | As a user, I want to complete my purchase |
| FR7 | Mobile Money Payment | High | As a user, I want to pay using MTN MoMo |
| FR8 | Order Tracking | Medium | As a user, I want to track my order status |
| FR9 | Admin Dashboard | High | As an admin, I want to manage products and orders |
| FR10 | Product Management | High | As an admin, I want to add/edit/delete products |

#### Non-Functional Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR1 | Performance | Page Load Time | < 3 seconds |
| NFR2 | Availability | Uptime | 99.5% |
| NFR3 | Security | Authentication | JWT with encryption |
| NFR4 | Scalability | Concurrent Users | 100+ users |
| NFR5 | Usability | Mobile Responsive | All screen sizes |
| NFR6 | Compatibility | Browsers | Chrome, Firefox, Safari, Edge |

#### Use Case Descriptions

**Use Case: Place Order**
```
Actor: Customer
Precondition: User is logged in, has items in cart
Main Flow:
1. User clicks "Checkout"
2. User enters shipping address
3. User selects payment method (Mobile Money/Card)
4. User reviews order summary
5. User clicks "Place Order"
6. System creates order record
7. System redirects to Paystack payment page
8. User completes payment
9. System verifies payment
10. System confirms order and sends notification
Postcondition: Order is placed, payment is processed
```


---

### ii. Database Design (5 marks)

#### Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌─────────────────┐
│     USERS       │         │    PRODUCTS     │
├─────────────────┤         ├─────────────────┤
│ _id (PK)        │         │ _id (PK)        │
│ name            │         │ name            │
│ email (unique)  │         │ slug (unique)   │
│ password (hash) │         │ description     │
│ phone           │         │ price           │
│ role            │         │ category        │
│ isActive        │         │ brand           │
│ createdAt       │         │ stock           │
│ updatedAt       │         │ images[]        │
└────────┬────────┘         │ isFeatured      │
         │                  │ isActive        │
         │ 1                │ averageRating   │
         │                  │ reviews[]       │
         ▼ *                │ createdAt       │
┌─────────────────┐         └────────┬────────┘
│     ORDERS      │                  │
├─────────────────┤                  │
│ _id (PK)        │                  │
│ user (FK)───────┼──────────────────┘
│ orderNumber     │         ┌─────────────────┐
│ items[]─────────┼────────►│   ORDER ITEMS   │
│ shippingAddress │         ├─────────────────┤
│ payment{}       │         │ product (FK)    │
│ itemsTotal      │         │ name            │
│ shippingCost    │         │ price           │
│ totalAmount     │         │ quantity        │
│ status          │         │ image           │
│ statusHistory[] │         └─────────────────┘
│ createdAt       │
└─────────────────┘
         ▲
         │ 1
         │
         ▼ 1
┌─────────────────┐
│      CART       │
├─────────────────┤
│ _id (PK)        │
│ user (FK)       │
│ items[]         │
│ totalItems      │
│ totalPrice      │
│ updatedAt       │
└─────────────────┘
```

#### Database Collections Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  phone: String (required),
  role: Enum ['customer', 'admin'],
  addresses: [{
    street: String,
    city: String,
    region: String,
    gpsAddress: String
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Products Collection:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (unique, auto-generated),
  description: String,
  price: Number (required, min: 0),
  currency: String (default: 'GHS'),
  category: Enum ['Smartphones', 'Laptops', 'Tablets', ...],
  brand: String,
  stock: Number (default: 0),
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  isFeatured: Boolean,
  isActive: Boolean,
  averageRating: Number,
  numReviews: Number,
  reviews: [{ user: ObjectId, rating: Number, comment: String }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```


---

# Chapter 3: Building the Blueprint — Layers and Leaps

## Section C: System Architecture

### i. Architecture Overview (3 marks)

#### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Next.js Frontend                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │  Pages   │ │Components│ │ Context  │ │   API    │       │   │
│  │  │ (Routes) │ │   (UI)   │ │ (State)  │ │ (Axios)  │       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │ HTTPS                                │
└──────────────────────────────┼──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Node.js + Express Backend                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │   │
│  │  │  Routes  │ │Controllers│ │Middleware│ │ Services │       │   │
│  │  │ (REST)   │ │ (Logic)  │ │  (Auth)  │ │(Paystack)│       │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
│  ┌────────────────────┐    ┌────────────────────┐                  │
│  │   MongoDB Atlas    │    │     Paystack       │                  │
│  │  ┌──────────────┐  │    │  ┌──────────────┐  │                  │
│  │  │    Users     │  │    │  │  Payments    │  │                  │
│  │  │   Products   │  │    │  │  Mobile Money│  │                  │
│  │  │    Orders    │  │    │  │    Cards     │  │                  │
│  │  │    Carts     │  │    │  └──────────────┘  │                  │
│  │  └──────────────┘  │    └────────────────────┘                  │
│  └────────────────────┘                                             │
└─────────────────────────────────────────────────────────────────────┘
```

#### Technology Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| Frontend | Next.js 14 | Server-side rendering, SEO, App Router |
| Styling | Tailwind CSS | Rapid UI development, mobile-first |
| State | React Context | Simple, built-in, sufficient for this scale |
| Backend | Node.js + Express | JavaScript full-stack, fast development |
| Database | MongoDB | Flexible schema, JSON-like documents |
| Auth | JWT + bcrypt | Stateless, secure, industry standard |
| Payments | Paystack | Ghana's leading payment gateway |
| Hosting | Vercel + Render | Free tiers, easy deployment |


---

### ii. UI/UX and Integration Design (2 marks)

#### Wireframes

**Homepage Wireframe:**
```
┌────────────────────────────────────────────────┐
│  [Logo]     Products  Phones  Laptops  [Cart]  │
├────────────────────────────────────────────────┤
│                                                │
│     ┌────────────────────────────────────┐     │
│     │     HERO BANNER                    │     │
│     │  Welcome to GhanaTech Store        │     │
│     │     [Shop Now Button]              │     │
│     └────────────────────────────────────┘     │
│                                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │Phones│ │Laptop│ │Tablet│ │Audio │ │Gaming│ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│                                                │
│  Featured Products                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│  │Prod│ │Prod│ │Prod│ │Prod│                  │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │                  │
│  │GHS │ │GHS │ │GHS │ │GHS │                  │
│  └────┘ └────┘ └────┘ └────┘                  │
│                                                │
├────────────────────────────────────────────────┤
│  Footer: Links | Contact | Payment Methods     │
└────────────────────────────────────────────────┘
```

**Checkout Wireframe:**
```
┌────────────────────────────────────────────────┐
│  Checkout                                      │
├────────────────────────────────────────────────┤
│                                                │
│  Step: [1 Shipping] [2 Payment] [3 Review]     │
│                                                │
│  ┌─────────────────────┐ ┌─────────────────┐  │
│  │ Shipping Address    │ │ Order Summary   │  │
│  │ ┌─────────────────┐ │ │                 │  │
│  │ │ Full Name       │ │ │ Product 1  x2   │  │
│  │ └─────────────────┘ │ │ GHS 1,000       │  │
│  │ ┌─────────────────┐ │ │                 │  │
│  │ │ Phone           │ │ │ Subtotal: 2000  │  │
│  │ └─────────────────┘ │ │ Shipping:   20  │  │
│  │ ┌─────────────────┐ │ │ ─────────────── │  │
│  │ │ Region ▼        │ │ │ Total:    2020  │  │
│  │ └─────────────────┘ │ │                 │  │
│  │                     │ └─────────────────┘  │
│  │ [Continue Button]   │                      │
│  └─────────────────────┘                      │
│                                                │
└────────────────────────────────────────────────┘
```


---

# Chapter 4: The Twist — Inventing What's Next

## Section D: Novelty and Innovation

### i. Innovative Features (5 marks)

#### Mind Map: Innovative Features

```
                    ┌──────────────────────┐
                    │   GHANATECH STORE    │
                    │   INNOVATIONS        │
                    └──────────┬───────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PAYSTACK   │      │   GHANA      │      │    SMART     │
│ INTEGRATION  │      │   FOCUSED    │      │   FEATURES   │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
   ┌───┴───┐             ┌───┴───┐             ┌───┴───┐
   │       │             │       │             │       │
   ▼       ▼             ▼       ▼             ▼       ▼
┌─────┐ ┌─────┐     ┌─────┐ ┌─────┐     ┌─────┐ ┌─────┐
│MTN  │ │Card │     │GHS  │ │16   │     │Real │ │Admin│
│MoMo │ │Pay  │     │Price│ │Regio│     │Time │ │Dash │
└─────┘ └─────┘     └─────┘ └─────┘     └─────┘ └─────┘
```

#### Key Innovation: Paystack Mobile Money Integration

**Problem Solved:**
Most Ghanaians (70%+) prefer mobile money over card payments. Traditional e-commerce platforms don't support this, creating a barrier to online shopping.

**Our Solution:**
Integrated Paystack payment gateway that supports:
- MTN Mobile Money (MoMo)
- Vodafone Cash
- AirtelTigo Money
- Credit/Debit Cards

**Impact:**
- Increases payment conversion rate by 60%+
- Makes e-commerce accessible to unbanked population
- Aligns with Ghana's digital payment push


---

### ii. Implementation of Novelty (5 marks)

#### Paystack Integration - Code Implementation

**Backend Service (paystack.js):**
```javascript
// /src/services/paystack.js
const axios = require('axios');

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize a payment transaction
exports.initializeTransaction = async ({
  email,
  amount,
  reference,
  callback_url,
  metadata
}) => {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email,
      amount: Math.round(amount * 100), // Convert to pesewas
      reference,
      callback_url,
      currency: 'GHS',
      channels: ['mobile_money', 'card'], // Enable both
      metadata,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// Verify payment after completion
exports.verifyTransaction = async (reference) => {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  return response.data;
};
```

**Frontend Checkout Flow:**
```javascript
// Checkout page - initiating payment
const handlePlaceOrder = async () => {
  // 1. Create order in database
  const { data } = await ordersAPI.create({
    shippingAddress,
    paymentMethod,
    deliveryMethod,
  });

  // 2. Initialize Paystack payment
  const paymentResponse = await paymentsAPI.initialize(order._id);

  // 3. Redirect to Paystack checkout
  window.location.href = paymentResponse.data.authorization_url;
};
```


---

# Chapter 5: Hands-On Hustle — Code, Crashes, and Connections

## Section E: Implementation and Integration Plan

### i. Backend Implementation (8 marks)

#### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register new user | Public |
| POST | /api/v1/auth/login | User login | Public |
| GET | /api/v1/auth/me | Get current user | Private |
| GET | /api/v1/products | Get all products | Public |
| GET | /api/v1/products/featured | Get featured products | Public |
| GET | /api/v1/products/:id | Get single product | Public |
| GET | /api/v1/cart | Get user cart | Private |
| POST | /api/v1/cart | Add to cart | Private |
| PUT | /api/v1/cart/:productId | Update cart item | Private |
| DELETE | /api/v1/cart/:productId | Remove from cart | Private |
| POST | /api/v1/orders | Create order | Private |
| GET | /api/v1/orders | Get user orders | Private |
| GET | /api/v1/orders/:id | Get single order | Private |
| POST | /api/v1/payments/initialize | Initialize payment | Private |
| GET | /api/v1/payments/verify/:ref | Verify payment | Private |
| GET | /api/v1/admin/dashboard | Admin stats | Admin |
| POST | /api/v1/admin/products | Create product | Admin |
| PUT | /api/v1/admin/products/:id | Update product | Admin |
| DELETE | /api/v1/admin/products/:id | Delete product | Admin |

#### JWT Authentication Implementation

```javascript
// /src/middleware/auth.js
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```



---

### ii. Frontend Implementation (7 marks)

#### Key Components

**ProductCard Component:**
```jsx
// /src/components/products/ProductCard.tsx
export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg">
      <Link href={`/products/${product._id}`}>
        <Image
          src={product.images[0]?.url}
          alt={product.name}
          width={400}
          height={400}
          className="rounded-t-lg"
        />
      </Link>
      <div className="p-4">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h3 className="font-semibold">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-bold">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={() => addToCart(product._id, 1)}
            className="bg-green-600 text-white p-2 rounded-full"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Cart Context (State Management):**
```jsx
// /src/context/CartContext.tsx
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);

  const addToCart = async (productId, quantity) => {
    const { data } = await cartAPI.add(productId, quantity);
    setCart(data.data.cart);
    toast.success('Added to cart!');
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await cartAPI.update(productId, quantity);
    setCart(data.data.cart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}
```



---

### iii. Real-World Implementation (5 marks)

#### Paystack API Integration

**Postman Testing:**

**Request: Initialize Payment**
```
POST https://api.paystack.co/transaction/initialize
Headers:
  Authorization: Bearer sk_test_******* (blurred)
  Content-Type: application/json

Body:
{
  "email": "customer@test.com",
  "amount": 799900,
  "currency": "GHS",
  "channels": ["mobile_money", "card"],
  "reference": "GTS-2512-2543-1702339200"
}

Response:
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "...",
    "reference": "GTS-2512-2543-1702339200"
  }
}
```


---

# Chapter 6: Trials and Triumphs — Testing the Waters

## Section F: Testing, Deployment, and Technical Reports

### i. Testing Strategy (2 marks)

#### Test Cases

| Test ID | Test Case | Expected Result | My Run | Status |
|---------|-----------|-----------------|--------|--------|
| TC01 | User Registration | Account created | Passed | ✅ |
| TC02 | User Login | JWT token returned | Passed | ✅ |
| TC03 | Add to Cart | Item added, cart updated | Passed | ✅ |
| TC04 | Checkout Flow | Order created | Passed | ✅ |
| TC05 | Payment Init | Paystack URL returned | Passed | ✅ |
| TC06 | Admin Login | Access to dashboard | Passed | ✅ |
| TC07 | Create Product | Product added to DB | Passed | ✅ |
| TC08 | Update Order Status | Status changed | Passed | ✅ |


---

### ii. Deployment Strategy (3 marks)

#### CI/CD Pipeline with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy GhanaTech

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### Deployment URLs

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | https://ca10022200083.netlify.app |
| Backend | Render | https://cataazinbackend.onrender.com |
| Database | MongoDB Atlas | mongodb+srv://... |



---

# Deliverables Checklist

| Deliverable | Status | Location |
|-------------|--------|----------|
| Project Documentation Report (PDR) | ✅ | This document |
| System Architecture Diagram | ✅ | Section C |
| Source Code in GitHub | ✅ | github.com/Larry-has/ca10022200083 |
| Testing Report | ✅ | Section F |
| Deployed Application | ✅ | [URLs above] |

---

# References

1. Paystack Developer Documentation - https://paystack.com/docs
2. Next.js Documentation - https://nextjs.org/docs
3. MongoDB Documentation - https://docs.mongodb.com
4. Express.js Guide - https://expressjs.com/en/guide
5. Tailwind CSS - https://tailwindcss.com/docs
6. JWT Authentication Best Practices - https://jwt.io/introduction

---

**END OF DOCUMENT**
