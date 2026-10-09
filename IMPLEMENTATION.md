MANGA STORE — ECOMMERCE MVP IMPLEMENTATION PLAN
1. Project Overview

Build a new ecommerce website for Manga Store, a men's fashion/clothing brand based in Egypt.

Manga currently uses Instagram as a major channel for showcasing products and communicating with customers. They also offer delivery across Egypt, but the current ordering process appears to rely heavily on Instagram DMs/manual communication.

The goal of this project is to turn that process into a proper branded online store.

Core business problem

Current flow:

Instagram
   ↓
Customer sees product
   ↓
Customer sends DM
   ↓
Manual conversation
   ↓
Customer provides information
   ↓
Manual order processing
   ↓
Delivery

New flow:

Instagram / Social Media
        ↓
   Manga Website
        ↓
   Browse Products
        ↓
    Product Page
        ↓
      Cart
        ↓
     Checkout
        ↓
 Customer + Delivery Info
        ↓
 Cash on Delivery
        ↓
    Order Created
        ↓
    Admin Dashboard
        ↓
 Confirm / Prepare / Ship / Deliver

The website should therefore be both:

A premium fashion-brand website
A functional ecommerce ordering system

The customer-facing experience must feel like a modern clothing brand, not like an internal business application.

2. Important Product Philosophy

Do NOT build this as a generic CRUD ecommerce template.

The visual experience is extremely important.

The customer should feel:

"This is Manga's online store."

Not:

"This is a local shop with a website."

The website should be:

Modern
Premium
Fashion-focused
Image-heavy
Mobile-first
Fast
Minimal
Easy to navigate
Designed around the products

Instagram should remain an important discovery/marketing channel.

The website becomes the actual purchasing destination.

3. Initial Technology

Use a modern full-stack architecture.

Preferred stack:

Frontend
React
Vite
React Router
Tailwind CSS or an equally maintainable styling system
Responsive/mobile-first design
Backend
Node.js
Express.js
Database
MongoDB
Authentication
Secure admin authentication
API

REST API with clean separation between:

Public/customer endpoints
Admin endpoints

Use environment variables for all secrets and configuration.

Do not hardcode:

Database credentials
JWT secrets
Admin passwords
API keys
Production URLs
Sensitive configuration
4. Customer-Facing Website

The main website should contain the following areas.

Home

The homepage should establish the Manga brand immediately.

Suggested structure:

Hero

Large fashion imagery.

Brand:

MANGA

Supporting messaging around men's fashion / latest collection.

Primary CTA:

SHOP NOW

Secondary CTA can be:

NEW DROP

Featured / New Drop

Show a curated selection of products.

Example:

NEW DROP

[Product] [Product] [Product] [Product]

VIEW ALL

Products should be clickable.

Collections

Display the main clothing categories.

Examples:

T-Shirts
Hoodies
Pants
Jackets
New Arrivals

Do not hardcode these categories permanently. They should eventually come from the database.

Brand section

Short visual introduction to Manga.

Avoid a huge block of corporate text.

This should reinforce the fashion identity.

Delivery section

Clearly communicate that Manga delivers across Egypt.

Example concept:

MANGA DELIVERS ACROSS EGYPT

Keep this configurable so the wording can be changed later.

Physical Store

Manga currently has a physical presence at:

High Town Mall — 6 October

Include:

Location
Google Maps link
Opening hours if provided
Contact information

Do not invent opening hours.

Instagram

Provide a strong CTA to Manga's Instagram.

The website should complement Instagram rather than replace it.

5. Shop / Product Catalog

Create a dedicated shop/catalog page.

Customers should be able to:

Browse all products
Filter by category
Open product details
Add products to cart

Potential filters:

Category
Size
Color
Price
Collection

Only implement filters that are actually useful for the available product data.

Do not over-engineer filtering in the first version.

6. Product Model

Products should support clothing-specific information.

At minimum:

Product
├── name
├── slug
├── description
├── price
├── images
├── category
├── collection
├── availableSizes
├── availableColors
├── isAvailable
├── isFeatured
├── isNew
├── createdAt
└── updatedAt

The model should be extensible for future inventory/variant functionality.

Do NOT create a complicated inventory system unless it is necessary.

For the MVP, availability can be managed manually.

Example:

Available
Sold Out
7. Product Page

Product pages are one of the most important parts of the website.

The page should include:

Large product images
Product name
Price
Description
Available sizes
Available colors
Availability
Quantity selector
Add to Cart

Example:

MANGA OVERSIZED TEE

EGP 899

Available sizes:

S   M   L   XL

Color:
Black

[ - ] 1 [ + ]

ADD TO CART

If a product has sizes, the customer must select a size before adding it to the cart.

If a product has colors, the customer must select a color before adding it to the cart.

The UI should clearly indicate unavailable options.

8. Cart

Build a proper shopping cart.

Cart should show:

Product
Selected size
Selected color
Quantity
Unit price
Item subtotal
Remove item
Update quantity

Then:

Subtotal
Delivery Fee
----------------
Total

The cart must survive normal page navigation.

For the MVP, local/client-side persistence is acceptable.

Do not require customer accounts to use the cart.

9. Checkout

The checkout should be extremely simple.

Do not make customers create an account.

Customer information

Collect:

Full name
Phone number
Delivery information

Collect:

Governorate
City / Area
Full address
Building / apartment / floor where appropriate

The exact fields should remain practical for Egyptian deliveries.

Do not collect unnecessary information.

10. Delivery System

Manga states that it delivers across Egypt.

Do NOT hardcode arbitrary delivery prices.

The system should be designed so delivery pricing can be configured.

For example:

Governorate
    ↓
Delivery fee

Potential future structure:

Cairo       → X EGP
Giza        → X EGP
Alexandria  → X EGP
Other       → X EGP

However, do not invent the actual prices.

For the prototype, use clearly marked placeholder delivery values.

The admin should eventually be able to configure delivery fees without changing application code.

If practical within MVP scope, allow delivery rules to be managed from the admin panel.

If this significantly expands scope, create the backend structure now but keep management simple.

11. Payment
MVP payment method:

Cash on Delivery

Do NOT integrate online payments in this first version.

Do not implement:

Stripe
Paymob
Fawry
Card payments
Wallet payments

Those can be future upgrades.

The checkout should clearly show:

Cash on Delivery

12. Order Creation

When the customer clicks:

PLACE ORDER

the backend should create an order.

The order must contain a snapshot of the relevant information at the time of purchase.

Example:

Order
├── orderNumber
├── customer
│   ├── name
│   └── phone
├── delivery
│   ├── governorate
│   ├── city
│   └── address
├── items
│   ├── product
│   ├── productNameSnapshot
│   ├── priceSnapshot
│   ├── size
│   ├── color
│   └── quantity
├── subtotal
├── deliveryFee
├── total
├── paymentMethod
├── status
├── createdAt
└── updatedAt

Do not rely only on the current product price after the order has been created.

The order should preserve the price/name information that existed when the customer placed the order.

13. Order Statuses

Use a clear order lifecycle.

Recommended MVP statuses:

Pending
Confirmed
Preparing
Shipped
Delivered
Cancelled

Initial status:

Pending

Admin can update the status.

The customer-facing order confirmation can communicate:

Your order has been received and Manga will contact you to confirm it.

Do not build complicated real-time order tracking yet.

14. Order Confirmation

After checkout:

Show a professional confirmation page.

Example:

ORDER RECEIVED

Thank you for shopping with Manga.

Order #MNG-1042

Your order has been received successfully.

Manga will contact you to confirm your order.

Order Summary

Product
Size
Quantity
Price

Subtotal
Delivery
Total

Then provide:

CONTACT MANGA ON WHATSAPP

if appropriate.

15. Admin Dashboard

Create a completely separate admin route.

Example:

/admin/login
/admin
/admin/orders
/admin/products
/admin/categories
/admin/delivery

The public customer should never see or access the admin interface through normal navigation.

16. Admin Authentication

Implement secure admin authentication.

Requirements:

Password hashing
Secure authentication
Protected admin routes
Protected API endpoints
Authentication middleware
No hardcoded credentials
Environment variables for secrets

Do not expose admin credentials in frontend code.

Do not rely solely on hiding the admin URL.

The backend must actually protect admin operations.

17. Admin Dashboard

The dashboard should give the owner/staff a quick overview.

Example:

DASHBOARD

Pending Orders       12
Confirmed Orders      8
Preparing             5
Shipped               7

Today's Orders        6
Today's Revenue       XXX EGP

Keep analytics simple.

The primary purpose is order management, not advanced business intelligence.

18. Admin Orders

Admin should be able to:

View orders
Open order details
View customer information
View delivery information
View ordered products
View total
Change order status
Cancel an order

Order detail:

ORDER #MNG-1042

Customer
Ahmed Mohamed
010XXXXXXXX

Delivery
Giza
6 October
Full address...

Products
Oversized Tee — XL ×1
Cargo Pants — L ×1

Subtotal
1,898 EGP

Delivery
100 EGP

Total
1,998 EGP

Payment
Cash on Delivery

Status
Pending

[CONFIRM]
[PREPARING]
[SHIPPED]
[DELIVERED]
[CANCEL]

The admin UI should make processing an order extremely fast.

19. Admin Products

Admin should be able to manage the catalog.

At minimum:

Create product
Edit product
Delete/archive product
Change price
Change description
Upload/change images
Set category
Set available sizes
Set available colors
Mark available/unavailable
Mark featured
Mark new

Avoid permanently deleting products that are referenced by historical orders if that could break order history.

Prefer archiving/deactivating products.

20. Product Images

Design the image system so products can have multiple images.

Example:

Product
├── main image
├── front
├── back
├── detail
└── lifestyle

The frontend should display these as a modern gallery.

For the prototype, placeholder images/data can be used.

Make it easy to replace them with Manga's real product images later.

21. WhatsApp Integration

WhatsApp should complement the ecommerce system, not replace it.

Useful locations:

Product page

Questions about this product? Chat on WhatsApp

Order confirmation

Need help? Contact Manga

Admin

Potentially provide a button to contact the customer.

Do not build WhatsApp API automation in the MVP.

Simply generate/open a WhatsApp conversation where appropriate.

No paid WhatsApp Business API should be required for this version.

22. Responsive Design

This is extremely important.

The majority of traffic will likely come from Instagram users on phones.

Therefore:

Mobile-first.

The website must look excellent on:

Mobile
Tablet
Desktop

Do not simply shrink the desktop layout.

Design the mobile experience intentionally.

Pay particular attention to:

Product images
Product grid
Navigation
Cart
Checkout
Buttons
Form inputs
Product selection
Admin usability
23. Visual Design Direction

The website should feel like a modern men's fashion brand.

Use Manga's actual branding once available.

The design should prioritize:

Large imagery
Strong typography
Generous spacing
Clean product grids
Minimal UI chrome
Strong CTAs
High-quality product presentation

Avoid:

Generic Bootstrap appearance
Excessive rounded cards
Excessive shadows
Cluttered dashboards on customer pages
Too much text
Generic ecommerce template aesthetics

The storefront should feel premium.

The admin dashboard can be functional and utilitarian.

24. SEO / Social Sharing

The public website should be prepared for search and social sharing.

Implement basic:

Page titles
Meta descriptions
Product metadata
Clean URLs/slugs
Open Graph metadata
Favicon
Proper semantic HTML

Product URLs should be human-readable.

Example:

/products/oversized-manga-tee

Not:

/products/938472
25. Security Requirements

Treat this as a real ecommerce application.

Backend
Validate all incoming data
Sanitize appropriate user input
Validate product IDs
Validate quantities
Validate sizes/colors against available product options
Never trust frontend prices
Calculate totals on the backend
Calculate delivery fees on the backend
Protect admin routes
Hash passwords
Secure authentication
Do not expose secrets
Handle malformed requests
Prevent customers from manipulating order totals
Important:

The frontend must NEVER be trusted for:

price
delivery fee
total
admin permissions
product availability

The backend should recalculate and validate these values.

26. API Structure

Keep the API organized.

Example:

/api/products
/api/categories
/api/orders
/api/delivery
/api/admin/auth
/api/admin/products
/api/admin/orders
/api/admin/delivery

Separate public and admin functionality.

Use controllers/services/models rather than putting everything inside route files.

Keep the architecture maintainable.

27. Database Models

At minimum consider:

User/Admin
Product
Category
Order
DeliveryRule

Potential relationships:

Category
   ↓
Products
   ↓
Order Items
   ↓
Orders

Historical orders should retain snapshots of important product information.

28. Prototype Data

At the beginning, use realistic placeholder Manga data.

Clearly structure the application so that the placeholder data can later be replaced with:

Real products
Real prices
Real images
Real sizes
Real categories
Real delivery fees
Real contact information

Do NOT present fake data as confirmed Manga information.

Use placeholders where the real information has not been provided.

29. Important Scope Boundary

This is an MVP.

Do not unnecessarily expand it into a massive ecommerce platform.

NOT included in MVP:
Online payment
Customer accounts
Loyalty program
Coupons/discount engine
Reviews
Wishlist
Advanced inventory management
Automated shipping provider integration
Automated WhatsApp API
Email marketing
SMS automation
Abandoned cart recovery
Multi-vendor functionality
Advanced analytics
AI recommendations
Complex promotions
Subscription system

These can be future versions.

30. Future Architecture

Even though these features are not being built now, avoid architectural decisions that make them impossible later.

Possible V2 features:

Online Payments
      ↓
Shipping Integration
      ↓
Inventory Management
      ↓
Customer Accounts
      ↓
Coupons
      ↓
Wishlist
      ↓
Reviews
      ↓
Automated Notifications
      ↓
Advanced Analytics

The MVP should be clean enough to evolve into these features.

31. Recommended Build Order

Do not build everything simultaneously.

Follow this order.

Phase 1 — Project foundation
Initialize project
Configure frontend
Configure backend
Configure MongoDB
Environment variables
Basic folder architecture
API structure
Error handling
Authentication foundation
Phase 2 — Database

Create:

Admin/User
Product
Category
Order
DeliveryRule

Seed realistic placeholder data.

Phase 3 — Public storefront

Build:

Header/navigation
Homepage
Shop
Collections
Product page
Product gallery
Cart
Checkout
Order confirmation

Make this experience polished before moving to the admin.

Phase 4 — Ordering backend

Implement:

Cart/order validation
Checkout API
Server-side price calculation
Delivery fee calculation
Order creation
Order number generation
Order status system

Test invalid/malicious requests as well as normal requests.

Phase 5 — Admin

Build:

Admin login
Dashboard
Orders
Order details
Status management
Products
Categories
Delivery configuration
Phase 6 — WhatsApp

Add:

Product WhatsApp contact
Order/customer contact where appropriate

No API automation.

Phase 7 — Design polish

Perform a dedicated UI pass.

Check:

Mobile
Tablet
Desktop
Typography
Product imagery
Loading states
Empty states
Error states
Form validation
Cart UX
Checkout UX
Admin usability

Do not consider the project complete merely because the functionality works.

32. Testing Checklist

Before considering the MVP complete, test the entire customer flow:

Homepage
 ↓
Shop
 ↓
Product
 ↓
Select size
 ↓
Add to cart
 ↓
Cart
 ↓
Checkout
 ↓
Enter information
 ↓
Select delivery area
 ↓
Place order
 ↓
Order confirmation
 ↓
Admin receives order
 ↓
Admin confirms
 ↓
Admin changes status

Also test:

Missing required fields
Invalid phone number
Invalid product ID
Invalid size
Invalid quantity
Sold-out product
Manipulated frontend price
Manipulated delivery fee
Unauthorized admin API access
Expired/invalid authentication
Empty cart
Product deleted/archived after being added to cart
Mobile layout
33. Definition of Done

The MVP is complete when:

Customer can:
Visit Manga's website
Browse products
Browse collections
View product details
Select variants
Add products to cart
Modify cart
Checkout without creating an account
Enter Egyptian delivery information
Place a COD order
Receive an order confirmation
Contact Manga through WhatsApp
Manga/admin can:
Securely log into admin
View incoming orders
View complete customer/delivery information
View order items and totals
Change order status
Create/edit products
Manage product availability
Manage categories
Configure delivery fees/rules
System is:
Responsive
Secure
Validated server-side
Maintainable
Mobile-first
Visually consistent with a fashion brand
Ready to replace placeholder data with Manga's real data
34. Critical Instruction

Do not start by building random pages or components.

First understand the entire system and establish:

Database
      ↓
Backend/API
      ↓
Customer storefront
      ↓
Cart
      ↓
Checkout
      ↓
Orders
      ↓
Admin

Build in logical phases.

Do not over-engineer features outside the MVP.

At every stage, prioritize:

Business value → reliability → UX → visual polish → extensibility.

The final result should feel like a real Manga Store ecommerce platform, not a coding demo.

One final strategic note for the implementation

For the first prototype/demo, it's completely fine to use fake products, prices, images, and delivery fees. The important thing is that the system architecture and UX are real.

Once Manga shows interest, the placeholder catalog can be replaced with their actual products and business rules.

The most important thing to demonstrate is this:

Instagram → Manga website → product → cart → checkout → order → Manga admin

That complete loop is the product you're selling