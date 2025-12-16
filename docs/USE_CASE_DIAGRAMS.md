# Use Case Diagrams
## GhanaTech Store - E-Commerce Platform

---

## System Overview Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        GHANATECH STORE SYSTEM                                │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                    CUSTOMER USE CASES                           │      │
│    │                                                                 │      │
│    │    ┌────────────────┐    ┌────────────────┐                    │      │
│    │    │   Register     │    │     Login      │                    │      │
│    │    │   Account      │    │                │                    │      │
│    │    └───────┬────────┘    └───────┬────────┘                    │      │
│    │            │                     │                              │      │
│    │            └─────────┬───────────┘                              │      │
│    │                      │                                          │      │
│    │    ┌────────────────┐│   ┌────────────────┐                    │      │
│    │    │    Browse      │◄───┤    Search      │                    │      │
│    │    │   Products     │    │   Products     │                    │      │
│    │    └───────┬────────┘    └────────────────┘                    │      │
┌────┴──┐         │                                                    │      │
│       │         ▼                                                    │      │
│  C    │   ┌────────────────┐    ┌────────────────┐                  │      │
│  U    │   │   View         │    │    Add to      │                  │      │
│  S    │───┤   Product      │───►│    Cart        │                  │      │
│  T    │   │   Details      │    │                │                  │      │
│  O    │   └────────────────┘    └───────┬────────┘                  │      │
│  M    │                                 │                            │      │
│  E    │   ┌────────────────┐    ┌───────┴────────┐                  │      │
│  R    │   │   Update       │◄───┤   View         │                  │      │
│       │   │   Cart         │    │   Cart         │                  │      │
│       │   └────────────────┘    └───────┬────────┘                  │      │
│       │                                 │                            │      │
│       │   ┌────────────────┐    ┌───────┴────────┐                  │      │
│       │   │   Enter        │◄───┤   Checkout     │                  │      │
│       │   │   Address      │    │                │                  │      │
│       │   └───────┬────────┘    └────────────────┘                  │      │
│       │           │                                                  │      │
│       │   ┌───────┴────────┐    ┌────────────────┐                  │      │
│       │   │   Select       │───►│   Make         │──────┐           │      │
│       │   │   Payment      │    │   Payment      │      │           │      │
│       │   └────────────────┘    └────────────────┘      │           │      │
│       │                                                  │           │      │
│       │   ┌────────────────┐    ┌────────────────┐      │           │      │
│       │   │   Track        │◄───┤   View         │      │           │      │
│       │   │   Order        │    │   Orders       │      │           │      │
└───────┘   └────────────────┘    └────────────────┘      │           │      │
│                                                          │           │      │
│    └─────────────────────────────────────────────────────┼───────────┘      │
│                                                          │                  │
│    ┌─────────────────────────────────────────────────────┼───────────┐      │
│    │                    ADMIN USE CASES                  │           │      │
│    │                                                     ▼           │      │
│    │    ┌────────────────┐    ┌────────────────┐   ┌─────────┐      │      │
│    │    │   Manage       │    │   Manage       │   │PAYSTACK │      │      │
│    │    │   Products     │    │   Orders       │   │   API   │      │      │
│    │    └───────┬────────┘    └───────┬────────┘   └─────────┘      │      │
┌────┴──┐         │                     │              External        │      │
│       │    ┌────┴─────┬───────┬───────┤              System          │      │
│  A    │    │          │       │       │                              │      │
│  D    │    ▼          ▼       ▼       ▼                              │      │
│  M    │ ┌──────┐  ┌──────┐ ┌──────┐ ┌──────┐                        │      │
│  I    │ │ Add  │  │ Edit │ │Delete│ │Update│                        │      │
│  N    │ │Produc│  │Produc│ │Produc│ │Status│                        │      │
│       │ └──────┘  └──────┘ └──────┘ └──────┘                        │      │
│       │                                                              │      │
│       │    ┌────────────────┐    ┌────────────────┐                 │      │
│       │    │   View         │    │   Manage       │                 │      │
│       │────┤   Dashboard    │    │   Users        │                 │      │
│       │    │   (Stats)      │    │                │                 │      │
└───────┘    └────────────────┘    └────────────────┘                 │      │
│                                                                      │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Use Case 1: Customer Registration

```
┌────────────────────────────────────────────────────────────────┐
│              USE CASE: USER REGISTRATION                        │
└────────────────────────────────────────────────────────────────┘

Actor: Customer (Guest)

                    ┌─────────────────┐
                    │    Customer     │
                    │    (Guest)      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Register      │
                    │   Account       │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │ <<include>>   │ │ <<include>>   │ │ <<extend>>    │
    │ Validate      │ │ Hash          │ │ Email         │
    │ Input         │ │ Password      │ │ Verification  │
    └───────────────┘ └───────────────┘ └───────────────┘

DESCRIPTION:
- User provides: name, email, password, phone
- System validates email format and uniqueness
- Password is hashed using bcrypt
- Account created with 'customer' role

PRECONDITIONS:
- User is not logged in
- Email is not already registered

POSTCONDITIONS:
- New user account created
- User can login with credentials

MAIN FLOW:
1. User clicks "Register" button
2. User fills in registration form
3. System validates all fields
4. System checks email uniqueness
5. System hashes password
6. System creates user record
7. System returns JWT token
8. User is redirected to homepage
```

---

## Use Case 2: Place Order

```
┌────────────────────────────────────────────────────────────────┐
│              USE CASE: PLACE ORDER                              │
└────────────────────────────────────────────────────────────────┘

Actor: Registered Customer

                    ┌─────────────────┐
                    │    Customer     │
                    │  (Logged In)    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Place Order   │
                    └────────┬────────┘
                             │
    ┌────────────────────────┼────────────────────────┐
    │                        │                        │
    ▼                        ▼                        ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ <<include>>   │    │ <<include>>   │    │ <<include>>   │
│ View Cart     │    │ Enter         │    │ Select        │
│               │    │ Address       │    │ Payment       │
└───────────────┘    └───────────────┘    └───────┬───────┘
                                                   │
                                    ┌──────────────┼──────────────┐
                                    │              │              │
                                    ▼              ▼              ▼
                            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
                            │Mobile Money │ │ Card        │ │ Cash on     │
                            │(MoMo)       │ │ Payment     │ │ Delivery    │
                            └──────┬──────┘ └──────┬──────┘ └─────────────┘
                                   │               │
                                   └───────┬───────┘
                                           │
                                           ▼
                                   ┌───────────────┐
                                   │   Paystack    │
                                   │   Payment     │
                                   │   Gateway     │
                                   └───────────────┘

DESCRIPTION:
- Customer completes checkout with items in cart
- Selects shipping address and payment method
- For MoMo/Card: redirected to Paystack
- Order created and tracked

PRECONDITIONS:
- User is logged in
- Cart has items
- Valid shipping address provided

POSTCONDITIONS:
- Order record created
- Cart cleared (on success)
- Payment processed

MAIN FLOW:
1. User clicks "Checkout"
2. User enters/selects shipping address
3. User selects region (for shipping cost)
4. User selects delivery method
5. User selects payment method
6. User reviews order summary
7. User clicks "Place Order"
8. System creates order record
9. If MoMo/Card:
   a. System initializes Paystack payment
   b. User redirected to Paystack
   c. User completes payment
   d. System verifies payment
10. Order confirmed
11. Cart cleared

ALTERNATIVE FLOWS:
A1. Payment Failed:
    - User notified
    - Order status: pending
    - User can retry payment

A2. Cash on Delivery:
    - No Paystack redirect
    - Order status: processing
    - Payment on delivery
```

---

## Use Case 3: Admin Product Management

```
┌────────────────────────────────────────────────────────────────┐
│              USE CASE: MANAGE PRODUCTS                          │
└────────────────────────────────────────────────────────────────┘

Actor: Administrator

                    ┌─────────────────┐
                    │   Admin User    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Manage Products │
                    └────────┬────────┘
                             │
        ┌──────────┬─────────┼─────────┬──────────┐
        │          │         │         │          │
        ▼          ▼         ▼         ▼          ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   List    │ │   Add     │ │   Edit    │ │  Delete   │ │  Toggle   │
│  Products │ │  Product  │ │  Product  │ │  Product  │ │  Status   │
└───────────┘ └─────┬─────┘ └─────┬─────┘ └───────────┘ └───────────┘
                    │             │
                    ▼             ▼
            ┌───────────────────────────┐
            │      <<include>>          │
            │   Upload Images           │
            │   Set Price (GHS)         │
            │   Set Stock Quantity      │
            │   Select Category         │
            └───────────────────────────┘

CRUD OPERATIONS:
┌────────┬───────────────────────────────────────────────────┐
│ Action │ Description                                       │
├────────┼───────────────────────────────────────────────────┤
│ CREATE │ Add new product with name, price, images, stock   │
│ READ   │ View all products, filter by category/status      │
│ UPDATE │ Edit product details, update stock/price          │
│ DELETE │ Remove product (soft delete - isActive: false)    │
└────────┴───────────────────────────────────────────────────┘

PRECONDITIONS:
- User is logged in with admin role
- Valid product data provided

POSTCONDITIONS:
- Product catalog updated
- Changes visible to customers
```

---

## Use Case 4: Admin Order Management

```
┌────────────────────────────────────────────────────────────────┐
│              USE CASE: MANAGE ORDERS                            │
└────────────────────────────────────────────────────────────────┘

Actor: Administrator

                    ┌─────────────────┐
                    │   Admin User    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Manage Orders  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ View All      │    │ View Order    │    │ Update        │
│ Orders        │    │ Details       │    │ Status        │
└───────────────┘    └───────────────┘    └───────┬───────┘
                                                   │
                            ┌──────────────────────┴───────┐
                            │                              │
                            ▼                              ▼
                    ┌───────────────┐            ┌───────────────┐
                    │ Status Flow   │            │ Notify        │
                    │               │            │ Customer      │
                    │ pending       │            │               │
                    │    ↓          │            │ <<extend>>    │
                    │ processing    │            └───────────────┘
                    │    ↓          │
                    │ shipped       │
                    │    ↓          │
                    │ delivered     │
                    └───────────────┘

ORDER STATUS FLOW:
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────┐    ┌───────────┐    ┌─────────┐    ┌──────────┐ │
│   │ PENDING  │───►│PROCESSING │───►│ SHIPPED │───►│DELIVERED │ │
│   └──────────┘    └───────────┘    └─────────┘    └──────────┘ │
│        │                                                        │
│        │         ┌───────────┐                                  │
│        └────────►│ CANCELLED │                                  │
│                  └───────────┘                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Use Case 5: Mobile Money Payment

```
┌────────────────────────────────────────────────────────────────┐
│              USE CASE: MOBILE MONEY PAYMENT                     │
└────────────────────────────────────────────────────────────────┘

Actors: Customer, Paystack (External System)

                    ┌─────────────────┐
                    │    Customer     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Pay with       │
                    │  Mobile Money   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │ Select        │ │ Redirect to   │ │ Enter MoMo    │
    │ MoMo Provider │ │ Paystack      │ │ Number        │
    │ (MTN/Voda/AT) │ │               │ │               │
    └───────────────┘ └───────────────┘ └───────┬───────┘
                                                 │
                                                 ▼
                                        ┌───────────────┐
                                        │   Paystack    │
                                        │   Gateway     │
                                        └───────┬───────┘
                                                 │
                            ┌────────────────────┴────────────┐
                            │                                 │
                            ▼                                 ▼
                    ┌───────────────┐                ┌───────────────┐
                    │ USSD Push     │                │ User Confirms │
                    │ to Phone      │───────────────►│ on Phone      │
                    └───────────────┘                └───────┬───────┘
                                                             │
                                                             ▼
                                                    ┌───────────────┐
                                                    │ Payment       │
                                                    │ Verified      │
                                                    └───────────────┘

SEQUENCE:
1. Customer selects "Mobile Money" at checkout
2. System creates order with pending payment
3. System calls Paystack Initialize API
4. Customer redirected to Paystack checkout page
5. Customer selects mobile money provider (MTN/Voda/AT)
6. Customer enters mobile money number
7. USSD prompt sent to customer's phone
8. Customer approves payment on phone
9. Paystack processes payment
10. Customer redirected back to app
11. System verifies payment with Paystack
12. Order status updated to "processing"
```

---

## Actor Summary Table

| Actor | Type | Description | Use Cases |
|-------|------|-------------|-----------|
| Guest | Primary | Unregistered visitor | Browse, Search, Register |
| Customer | Primary | Registered user | All customer use cases |
| Admin | Primary | Store administrator | Product & Order management |
| Paystack | Secondary | Payment gateway | Process payments |
| MongoDB | Secondary | Database | Store all data |

---

## Use Case Priority Matrix

| Use Case | Priority | Complexity | Status |
|----------|----------|------------|--------|
| User Registration | High | Low | Implemented |
| User Login | High | Low | Implemented |
| Browse Products | High | Low | Implemented |
| Search Products | High | Medium | Implemented |
| Add to Cart | High | Medium | Implemented |
| Checkout | High | High | Implemented |
| Mobile Money Payment | High | High | Implemented |
| View Orders | Medium | Low | Implemented |
| Admin Dashboard | High | Medium | Implemented |
| Manage Products | High | Medium | Implemented |
| Manage Orders | High | Medium | Implemented |
| Manage Users | Medium | Low | Implemented |

---

*Use Case Diagrams for GhanaTech Store - CS/IT4131 Cloud Applications*
