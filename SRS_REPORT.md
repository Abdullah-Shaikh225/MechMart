# MechMart E‑Commerce Project – Software Requirements Specification (SRS)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) is to define the functional and non‑functional requirements for the **MechMart** e‑commerce web application. It serves as a reference for developers, testers, and stakeholders to ensure a shared understanding of the system’s behavior, performance, and constraints.

### 1.2 Scope
MechMart is an online marketplace for mechanical parts. It provides a responsive front‑end built with **React**, **TypeScript**, and **Vite**, and consumes a RESTful API for product data, user authentication, and order processing. The application includes features such as product browsing, search, pagination, shopping cart, checkout, user profile management, and a global loading animation.

### 1.4 Technologies Used
- **Frontend**: React, TypeScript, Vite, vanilla CSS, Inter font, ESLint, Prettier.
- **Backend / API**: RESTful API (e.g., Node/Express), JSON over HTTPS, JWT for authentication.
- **Database**: Relational database (e.g., PostgreSQL or MySQL) accessed via the API.
- **Build & Deployment**: Vite for bundling, npm scripts, static hosting (GitHub Pages, Netlify, Vercel).

### 1.3 Definitions, Acronyms, and Abbreviations
- **UI** – User Interface
- **API** – Application Programming Interface
- **SPA** – Single‑Page Application
- **SRS** – Software Requirements Specification
- **Viva** – Oral examination / interview format
- **CORS** – Cross‑Origin Resource Sharing
- **JWT** – JSON Web Token

### 1.4 References
- Vite documentation: https://vitejs.dev/
- React documentation: https://reactjs.org/
- ESLint configuration in `eslint.config.js`
- Project README for setup instructions.

### 1.5 Overview of Document
The SRS is organized into the following sections:
1. Introduction (this section)
2. Overall Description
3. Specific Requirements (functional & non‑functional)
4. System Models (use‑case, data, component)
5. External Interface Requirements
6. Verification & Validation
7. Appendices

---

## 2. Overall Description

### 2.1 Product Perspective
MechMart is a **stand‑alone web application** that runs entirely in the browser. It does **not** embed a back‑end server; instead it communicates with an external REST API (e.g., `https://api.mechmart.com`). The front‑end is packaged as static assets (`dist/`) that can be hosted on any static web server (GitHub Pages, Netlify, Vercel, etc.).

### 2.2 Product Functions
| Feature | Description |
|---|---|
| **User Registration / Login** | Users can create accounts, log in, and receive JWT tokens stored in `localStorage`. |
| **Product Catalog** | Browse, filter, and search mechanical parts. Pagination loads 20 items per page. |
| **Product Detail** | Detailed view with specifications, images, and add‑to‑cart button. |
| **Shopping Cart** | Add, remove, and update quantity of items. Cart persists across sessions via `localStorage`. |
| **Checkout** | Collect shipping information and submit order to API. |
| **Admin Panel (future)** | Manage products, categories, and orders. |
| **Global Loading Animation** | Full‑screen overlay with spinner, reusable across pages. |
| **Responsive Design** | Works on desktop, tablet, and mobile devices. |

### 2.3 User Classes & Characteristics
| Role | Capabilities |
|---|---|
| **Guest** | Browse catalog, view product details, add items to cart (local only). |
| **Registered User** | All guest capabilities plus login, persistent cart, place orders, view order history. |
| **Administrator** *(planned)* | Manage product inventory, view all orders, edit site content. |

### 2.4 Operating Environment
- **Client**: Modern browsers (Chrome, Edge, Firefox, Safari) on Windows/macOS/Linux.
- **Build Tools**: Node.js ≥ 18, npm, Vite.
- **Deployment**: Static web server (any HTTP server). No server‑side rendering.

### 2.5 Design and Implementation Constraints
- Must use **React** with **TypeScript**.
- All styling is vanilla CSS (no Tailwind unless explicitly requested).
- ESLint/Prettier enforced via `eslint.config.js`.
- No server‑side code in this repository.
- Environment variables defined in `.env` (e.g., `VITE_API_BASE_URL`).

### 2.6 Assumptions & Dependencies
- The back‑end API conforms to the documented contract (endpoints, request/response schemas).
- Users have internet connectivity.
- API provides CORS headers allowing the front‑end origin.

---

## 3. Specific Requirements

### 3.1 Functional Requirements
#### FR‑1: User Authentication
- **FR‑1.1**: Users can register with email, password, and name.
- **FR‑1.2**: Passwords are sent over HTTPS and stored hashed on the server.
- **FR‑1.3**: Upon successful login, a JWT token is stored in `localStorage` and attached to subsequent API calls via `Authorization: Bearer <token>` header.
- **FR‑1.4**: Token expiration triggers automatic logout and redirect to login page.

#### FR‑2: Product Catalog
- **FR‑2.1**: `GET /products?page={n}&search={query}` returns paginated list (20 items per page).
- **FR‑2.2**: Search supports partial matches on product name and SKU.
- **FR‑2.3**: UI displays product thumbnail, name, price, and short description.

#### FR‑3: Product Detail
- **FR‑3.1**: `GET /products/{id}` returns full product data.
- **FR‑3.2**: Detail page shows high‑resolution images, specifications table, and “Add to Cart” button.

#### FR‑4: Shopping Cart
- **FR‑4.1**: Adding a product stores it in a cart object persisted in `localStorage`.
- **FR‑4.2**: Users can modify quantity (1‑99) or remove items.
- **FR‑4.3**: Cart total updates in real time.

#### FR‑5: Checkout Process
- **FR‑5.1**: Checkout form collects name, address, phone, and payment method (mock).
- **FR‑5.2**: Submitting checkout sends `POST /orders` with cart payload.
- **FR‑5.3**: On success, order ID is displayed and cart cleared.

#### FR‑6: Global Loading Animation
- **FR‑6.1**: `LoadingOverlay` component renders a full‑screen semi‑transparent backdrop with a centered spinner.
- **FR‑6.2**: Overlay is shown automatically during any `fetch` request and hidden when the promise resolves or rejects.

#### FR‑7: Responsive Layout
- **FR‑7.1**: Layout adapts using CSS media queries for breakpoints: ≤768px (mobile), 769‑1024px (tablet), >1024px (desktop).

### 3.2 Non‑Functional Requirements
#### NFR‑1: Performance
- **NFR‑1.1**: Initial page load (HTML + JS + CSS) must be ≤ 2 seconds on a 3 G network (simulated via Chrome DevTools).
- **NFR‑1.2**: API responses must be cached for 5 minutes where appropriate (product list).

#### NFR‑2: Usability
- **NFR‑2.1**: All interactive elements must have a minimum touch target size of 44 × 44 px.
- **NFR‑2.2**: Keyboard navigation must be supported (tab order, focus outlines).

#### NFR‑3: Security
- **NFR‑3.1**: All communication uses HTTPS.
- **NFR‑3.2**: JWT tokens are stored only in `localStorage` and never exposed to third‑party scripts.
- **NFR‑3.3**: Content Security Policy (CSP) header enforced on the hosting server (e.g., `default-src 'self'`).

#### NFR‑4: Maintainability
- **NFR‑4.1**: Code follows the ESLint configuration; linting must pass with `npm run lint`.
- **NFR‑4.2**: Component files are limited to ≤ 300 lines; larger components are split.

#### NFR‑5: Portability
- **NFR‑5.1**: The built `dist/` folder can be deployed to any static host without modification.

---

## 4. System Models

### 4.1 Use‑Case Diagram (textual description)
- **UC‑1**: *Register Account* – Guest → Register → System creates user, returns JWT.
- **UC‑2**: *Login* – Guest → Login → System validates credentials, returns JWT.
- **UC‑3**: *Browse Products* – Guest/Registered → View Catalog → System returns paginated list.
- **UC‑4**: *View Product Detail* – Guest/Registered → Select Product → System returns product data.
- **UC‑5**: *Add to Cart* – Guest/Registered → Click “Add to Cart” → System updates local cart.
- **UC‑6**: *Checkout* – Registered → Fill Checkout Form → System creates order.
- **UC‑7**: *Logout* – Registered → Click Logout → System clears token.

### 4.2 Data Model (Entity‑Relationship description)
- **User** (id, email, name, hashedPassword, role)
- **Product** (id, sku, name, description, price, images[], specifications)
- **CartItem** (productId, quantity)
- **Order** (id, userId, items[], totalAmount, shippingInfo, status)

### 4.3 Component Diagram (high‑level)
```
App
 ├─ Router (react‑router)
 ├─ Layout
 │   ├─ Header
 │   ├─ Footer
 │   └─ LoadingOverlay
 ├─ Pages
 │   ├─ HomePage
 │   ├─ ProductListPage
 │   ├─ ProductDetailPage
 │   ├─ CartPage
 │   └─ CheckoutPage
 ├─ Components
 │   ├─ ProductCard
 │   ├─ Pagination
 │   ├─ CartItem
 │   └─ FormInput
 └─ Services
     └─ api.ts (fetch wrapper with auth & loading handling)
```

---

## 5. External Interface Requirements

### 5.1 User Interfaces
- All pages use semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`).
- CSS follows a dark‑mode friendly palette with primary hue `hsl(210, 40%, 55%)`.
- Font family: **Inter** (imported via Google Fonts).

### 5.2 Hardware Interfaces
- No special hardware required; runs on any device with a modern browser.

### 5.3 Software Interfaces
- **API Base URL**: `VITE_API_BASE_URL` defined in `.env` (e.g., `https://api.mechmart.com`).
- **Authentication Header**: `Authorization: Bearer <jwt>`.
- **Content Types**: `application/json` for request/response bodies.

### 5.4 Communications Interfaces
- HTTPS (TLS 1.2+) for all network traffic.
- CORS must allow origin `*` or the specific domain where the front‑end is hosted.

---

## 6. Verification & Validation

### 6.1 Test Strategy
- **Unit Tests**: Jest + React Testing Library for components (e.g., `ProductCard.test.tsx`).
- **Integration Tests**: Mock API responses using `msw` (Mock Service Worker).
- **End‑to‑End Tests**: Cypress to simulate user flows (registration → browse → checkout).
- **Manual Testing**: Verify responsive layout on Chrome DevTools device toolbar.
- **Performance Testing**: Lighthouse audit for SEO, performance, and accessibility.

### 6.2 Acceptance Criteria
- All functional requirements (FR‑1 … FR‑7) are demonstrated in a live build.
- No ESLint errors (`npm run lint` passes).
- Lighthouse scores ≥ 90 for Performance, Accessibility, Best Practices.
- Security headers (CSP, HSTS) are present when served via a static host.

---

## 7. Appendices

### 7.1 Glossary
- **JWT** – JSON Web Token, a compact, URL‑safe means of representing claims to be transferred between two parties.
- **CSP** – Content Security Policy, a security standard to prevent XSS and data injection attacks.

### 7.2 References
- React Hooks API: https://reactjs.org/docs/hooks-intro.html
- Vite Build Guide: https://vitejs.dev/guide/
- OWASP Top Ten for web security.

---
Admin Credentials
Username:admin@shopco.com
Password: admin123

*Document generated on 2026‑03‑01.*
