# Entity Relationship Diagram (ERD)
## GhanaTech Store Database Schema

---

## Visual ERD (ASCII Art)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           GHANATECH STORE ERD                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐                    ┌───────────────────────┐
│        USERS          │                    │       PRODUCTS        │
├───────────────────────┤                    ├───────────────────────┤
│ PK  _id: ObjectId     │                    │ PK  _id: ObjectId     │
│     name: String      │                    │     name: String      │
│     email: String *   │                    │     slug: String *    │
│     password: String  │                    │     description: Text │
│     phone: String     │                    │     price: Number     │
│     role: Enum        │                    │     currency: String  │
│     addresses: Array  │                    │     category: Enum    │
│     isActive: Boolean │                    │     brand: String     │
│     createdAt: Date   │                    │     stock: Number     │
│     updatedAt: Date   │                    │     images: Array     │
└───────────┬───────────┘                    │     isFeatured: Bool  │
            │                                │     isActive: Boolean │
            │ 1                              │     averageRating: #  │
            │                                │     numReviews: #     │
            │                                │     reviews: Array    │
            │                                │     tags: Array       │
            ▼ *                              │     createdAt: Date   │
┌───────────────────────┐                    │     updatedAt: Date   │
│        ORDERS         │                    └───────────┬───────────┘
├───────────────────────┤                                │
│ PK  _id: ObjectId     │                                │
│ FK  user: ObjectId ───┼────────────────────────────────┤
│     orderNumber: Str  │                                │
│     items: Array ─────┼────────────────────────────────┘
│     shippingAddress:{}│        * contains references to
│     payment: Object   │
│     itemsTotal: Number│         ┌───────────────────────┐
│     shippingCost: #   │         │     ORDER ITEMS       │
│     totalAmount: #    │         │    (Embedded Array)   │
│     deliveryMethod: E │         ├───────────────────────┤
│     status: Enum      │         │ FK  product: ObjectId │
│     statusHistory: [] │         │     name: String      │
│     createdAt: Date   │         │     price: Number     │
│     updatedAt: Date   │         │     quantity: Number  │
└───────────────────────┘         │     image: String     │
            ▲                     └───────────────────────┘
            │ 1
            │
            │ 1
            ▼
┌───────────────────────┐
│         CART          │
├───────────────────────┤
│ PK  _id: ObjectId     │
│ FK  user: ObjectId ───┼──► References USERS
│     items: Array ─────┼──► Contains CART ITEMS
│     totalItems: Number│
│     totalPrice: Number│
│     createdAt: Date   │
│     updatedAt: Date   │         ┌───────────────────────┐
└───────────────────────┘         │     CART ITEMS        │
                                  │    (Embedded Array)   │
                                  ├───────────────────────┤
                                  │ FK  product: ObjectId │
                                  │     quantity: Number  │
                                  │     price: Number     │
                                  └───────────────────────┘
```

---

## Relationships Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    RELATIONSHIP TABLE                         │
├────────────┬──────────────┬──────────────┬───────────────────┤
│ Entity A   │ Relationship │ Entity B     │ Cardinality       │
├────────────┼──────────────┼──────────────┼───────────────────┤
│ USER       │ has many     │ ORDER        │ 1 : N             │
│ USER       │ has one      │ CART         │ 1 : 1             │
│ ORDER      │ contains     │ ORDER ITEMS  │ 1 : N (embedded)  │
│ CART       │ contains     │ CART ITEMS   │ 1 : N (embedded)  │
│ ORDER ITEM │ references   │ PRODUCT      │ N : 1             │
│ CART ITEM  │ references   │ PRODUCT      │ N : 1             │
│ PRODUCT    │ has many     │ REVIEWS      │ 1 : N (embedded)  │
│ REVIEW     │ belongs to   │ USER         │ N : 1             │
└────────────┴──────────────┴──────────────┴───────────────────┘
```

---

## Detailed Entity Descriptions

### 1. USERS Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | PK, Auto | Unique identifier |
| name | String | Required | Full name |
| email | String | Required, Unique | Login email |
| password | String | Required, Hashed | bcrypt hashed |
| phone | String | Required | Ghana phone format |
| role | Enum | ['customer','admin'] | User role |
| addresses | Array | Optional | Saved addresses |
| isActive | Boolean | Default: true | Account status |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update |

### 2. PRODUCTS Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | PK, Auto | Unique identifier |
| name | String | Required | Product name |
| slug | String | Unique, Auto | URL-friendly name |
| description | String | Required | Product details |
| price | Number | Required, Min: 0 | Price in GHS |
| currency | String | Default: 'GHS' | Currency code |
| category | Enum | Required | Product category |
| brand | String | Required | Manufacturer |
| stock | Number | Default: 0 | Available quantity |
| images | Array | Required | Product images |
| isFeatured | Boolean | Default: false | Homepage display |
| isActive | Boolean | Default: true | Visibility |
| averageRating | Number | Computed | Avg review rating |
| numReviews | Number | Computed | Total reviews |
| reviews | Array | Embedded | User reviews |
| tags | Array | Optional | Search tags |

### 3. ORDERS Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | PK, Auto | Unique identifier |
| user | ObjectId | FK → Users | Order owner |
| orderNumber | String | Unique, Auto | Display number |
| items | Array | Required, Embedded | Ordered products |
| shippingAddress | Object | Required | Delivery address |
| payment | Object | Required | Payment details |
| itemsTotal | Number | Computed | Items subtotal |
| shippingCost | Number | Computed | Delivery fee |
| totalAmount | Number | Computed | Final total |
| deliveryMethod | Enum | Required | Shipping type |
| status | Enum | Default: 'pending' | Order status |
| statusHistory | Array | Auto | Status changes |

### 4. CART Collection

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | PK, Auto | Unique identifier |
| user | ObjectId | FK → Users, Unique | Cart owner |
| items | Array | Embedded | Cart products |
| totalItems | Number | Computed | Item count |
| totalPrice | Number | Computed | Cart total |

---

## Enum Values

### User Roles
```
['customer', 'admin']
```

### Product Categories
```
[
  'Smartphones',
  'Laptops',
  'Tablets',
  'Audio',
  'Gaming',
  'Accessories',
  'Wearables',
  'Networking',
  'Storage',
  'Cameras'
]
```

### Order Status
```
[
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
]
```

### Payment Methods
```
[
  'mobile_money',
  'card',
  'cash_on_delivery'
]
```

### Delivery Methods
```
[
  'standard',
  'express',
  'pickup'
]
```

### Ghana Regions (16)
```
[
  'Greater Accra', 'Ashanti', 'Western', 'Eastern',
  'Central', 'Northern', 'Volta', 'Upper East',
  'Upper West', 'Brong Ahafo', 'Western North', 'Ahafo',
  'Bono East', 'Oti', 'North East', 'Savannah'
]
```

---

## MongoDB Indexes

```javascript
// Users - for login lookup
db.users.createIndex({ email: 1 }, { unique: true })

// Products - for category filtering and search
db.products.createIndex({ category: 1 })
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ name: 'text', description: 'text' })
db.products.createIndex({ isFeatured: 1, isActive: 1 })

// Orders - for user order history
db.orders.createIndex({ user: 1, createdAt: -1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })

// Carts - for cart lookup
db.carts.createIndex({ user: 1 }, { unique: true })
```

---

## Data Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     DATA FLOW IN ORDER PROCESS                  │
└────────────────────────────────────────────────────────────────┘

    ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
    │  USER   │─────►│  CART   │─────►│  ORDER  │─────►│ PAYMENT │
    │ (Login) │      │  (Add)  │      │(Create) │      │(Paystack)
    └────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
         │                │                │                │
         ▼                ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
    │MongoDB  │      │MongoDB  │      │MongoDB  │      │ Paystack│
    │Users    │      │Carts    │      │Orders   │      │   API   │
    └─────────┘      └─────────┘      └─────────┘      └─────────┘

    1. User logs in → Auth token stored
    2. Browse products → Add to Cart
    3. Cart stored in MongoDB
    4. Checkout → Order created
    5. Payment initialized → Paystack redirect
    6. Payment verified → Order status updated
```

---

*This ERD represents the MongoDB document structure for GhanaTech Store*
