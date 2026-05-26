# Shaadi Connect - Wedding Planning Platform

## Project Overview

**Shaadi Connect** is a full-stack wedding planning platform that connects couples with verified wedding vendors, offers AI-powered assistance, handles secure payments, and provides honeymoon planning — all in one place.

**Live Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Spring Boot 3.3.5 + Spring Security + JWT + MySQL
- **AI:** Google Gemini 2.0 Flash API
- **Payments:** Razorpay Payment Gateway
- **Voice:** ElevenLabs Text-to-Speech API

---

## How We Built This Project (Step-by-Step)

### Phase 1: Project Setup & Planning

1. **Defined the problem statement** — Couples struggle to find reliable wedding vendors, manage bookings, and plan honeymoons in one place.
2. **Chose the tech stack** — React + Spring Boot for a modern, scalable full-stack app.
3. **Created the project structure:**
   - Frontend scaffolded with Vite + TypeScript template
   - Backend initialized with Spring Initializr (Web, JPA, Security, MySQL, Mail, Validation)

### Phase 2: Backend Development

#### Step 1 — Database Design & Entity Modeling
- Designed 4 core entities: `User`, `Vendor`, `Booking`, `PaymentTransaction`
- Used JPA annotations (`@Entity`, `@ManyToOne`, `@ElementCollection`) for ORM mapping
- Created enums for `UserRole`, `BookingStatus`, `PaymentStatus`

#### Step 2 — Authentication System (JWT)
- Implemented `JwtUtil` for token generation, validation, and extraction
- Built `JwtFilter` to intercept requests and validate tokens
- Configured `SecurityConfig` with stateless session management and BCrypt password encoding
- Created `/api/signup`, `/api/login`, `/api/verify-token` endpoints
- Added password reset flow with security question verification

#### Step 3 — Vendor Management APIs
- Built CRUD endpoints for vendors
- Implemented admin-only access using `@PreAuthorize` annotations
- Added vendor filtering, specialties, portfolio, and verified status

#### Step 4 — Booking System
- Created booking flow tied to vendors
- Captured event details, deposit, payment method, UPI ID
- Integrated email notifications on successful booking

#### Step 5 — Payment Integration (Razorpay)
- Integrated Razorpay Java SDK for order creation
- Implemented HMAC SHA-256 signature verification
- Built `/api/create-order` and `/api/verify-payment` endpoints
- Added mock order fallback for development/testing

#### Step 6 — AI-Powered Honeymoon Planner
- Integrated Google Gemini 2.0 Flash API
- Built prompt engineering for structured JSON responses (flights, hotels, itinerary)
- Added budget-based suggestions and day-by-day planning
- Implemented mock data fallback when API is unavailable

#### Step 7 — Admin Dashboard APIs
- Created `/api/admin/stats` endpoint returning total users, vendors, bookings, revenue
- Secured with role-based access control

### Phase 3: Frontend Development

#### Step 1 — UI Foundation
- Set up Tailwind CSS with custom wedding-themed design tokens
- Installed shadcn/ui component library (30+ Radix UI-based components)
- Configured React Router for navigation

#### Step 2 — Landing Page & Navigation
- Built `Header` with responsive navigation and login/signup modals
- Created `HeroSection` with call-to-action
- Designed `VendorCategories` with category cards
- Built `FeaturedVendors` with booking, contact, and details modals

#### Step 3 — Authentication UI
- Created `LoginSignupPage` with form validation (react-hook-form + zod)
- Implemented JWT token storage and auto-login
- Built password reset flow with security question

#### Step 4 — Vendor Booking Flow
- Built multi-step booking modal with event details
- Integrated Razorpay checkout on frontend
- Added email confirmation via EmailJS

#### Step 5 — AI Chatbot
- Built `Chatbot` component with chat interface
- Integrated Google Gemini for wedding Q&A
- Added ElevenLabs TTS for voice responses
- Implemented Web Speech API as fallback
- Added geolocation for local vendor recommendations

#### Step 6 — Admin Dashboard
- Built `AdminDashboard` with statistics cards (users, vendors, bookings, revenue)
- Created vendor management table with add/delete functionality
- Used Recharts for data visualization

#### Step 7 — Additional Features
- `GovernmentSchemes` section with marriage assistance information
- `SchemeApplicationForm` for applying to schemes
- `About` section with platform details
- Dark/light theme toggle with next-themes

---

## Key Features Breakdown (For Interview Explanation)

### 1. JWT Authentication & Authorization
> "I implemented a complete auth system using Spring Security with JWT tokens. On login, the server generates a signed token (HMAC SHA-256, 24hr expiry) which the frontend stores and sends with every request. A custom JwtFilter intercepts requests, validates the token, and sets the security context. I also added role-based access — admin endpoints are protected with ROLE_ADMIN."

### 2. Razorpay Payment Integration
> "I integrated Razorpay for secure payments. The flow is: frontend requests an order → backend creates a Razorpay order with amount and currency → frontend opens Razorpay checkout → on success, frontend sends payment details to backend → backend verifies the HMAC SHA-256 signature to ensure the payment wasn't tampered with."

### 3. AI-Powered Chatbot (Google Gemini)
> "I built a wedding planning chatbot using Google Gemini 2.0 Flash. It handles venue recommendations, vendor suggestions, and marriage bureau information. I used prompt engineering to keep responses concise (under 50 words) and added ElevenLabs TTS so users can hear responses. The chatbot also uses the Geolocation API to give location-specific recommendations."

### 4. Honeymoon Planner with AI
> "The honeymoon planner takes user preferences (destination, budget, dates, interests) and calls Google Gemini to generate a structured itinerary. I engineered the prompt to return JSON with flights, hotels, and day-by-day plans. I also added mock data as a fallback when the API is unavailable."

### 5. Role-Based Admin Dashboard
> "The admin dashboard shows real-time stats (total users, vendors, bookings, revenue) fetched from aggregate queries. Admins can add/delete vendors. The frontend conditionally renders admin controls based on the user's role decoded from the JWT."

---

## Challenges Faced & How I Solved Them

### Basic Challenges

| Challenge | Problem | Solution |
|-----------|---------|----------|
| **CORS Issues** | Frontend (port 5173) couldn't call backend (port 5000) | Configured `CorsConfigurationSource` in Spring Security to allow specific origins, methods, and headers |
| **JWT Token Expiry** | Users getting logged out unexpectedly | Set 24hr expiry, added token verification endpoint, frontend checks token validity on app load |
| **MySQL Connection** | "Access denied" errors on startup | Configured correct credentials in `application.yml`, ensured MySQL service was running, created database manually first |
| **Tailwind Not Working** | Styles not applying after installation | Added content paths in `tailwind.config.ts`, imported Tailwind directives in main CSS file |
| **Form Validation** | Users submitting incomplete data | Used react-hook-form with zod schemas for client-side validation + Spring `@Valid` annotations for server-side |

### Medium Challenges

| Challenge | Problem | Solution |
|-----------|---------|----------|
| **Razorpay Signature Verification** | Payment verification failing silently | Implemented HMAC SHA-256 correctly — the signature is generated from `orderId + "|" + paymentId` using the Razorpay secret key, then compared with the received signature |
| **Spring Security + JWT Integration** | Security filter chain blocking legitimate requests | Configured `SecurityFilterChain` to permit public endpoints (`/api/login`, `/api/signup`), added JWT filter before `UsernamePasswordAuthenticationFilter`, disabled CSRF for stateless API |
| **Gemini API Response Parsing** | AI returning inconsistent JSON structures | Used careful prompt engineering with explicit JSON schema in the prompt, added `response.replace` to strip markdown code blocks, wrapped in try-catch with mock data fallback |
| **State Management Across Components** | Booking data needed across multiple modals | Used React Query for server state, lifted state up for modal flows, passed callbacks between parent-child components |
| **Email Notification Reliability** | Emails failing silently, no error feedback | Used both backend Spring Mail (for booking confirmations) and frontend EmailJS (for instant notifications), added try-catch with user-facing toast messages |
| **ElevenLabs TTS Integration** | Voice not working on all browsers | Implemented ElevenLabs as primary TTS, added Web Speech API (`window.speechSynthesis`) as fallback, handled audio blob creation and playback |

### Advanced Challenges

| Challenge | Problem | Solution |
|-----------|---------|----------|
| **Securing Admin Routes** | Anyone with a valid JWT could access admin APIs | Added `ROLE_ADMIN` check in both backend (`SecurityConfig` with role-based matchers) and frontend (conditional rendering based on decoded JWT role) |
| **Payment Race Conditions** | Double-click creating duplicate orders | Added loading states on buttons, verified order uniqueness on backend, used Razorpay's idempotency handling |
| **Gemini API Rate Limiting** | App crashing when API quota exceeded | Implemented mock data fallback (`getMockHoneymoonData()`), added error handling that gracefully degrades to pre-built responses |

---

## Project Architecture

```
Shaadi_Connect/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/          # UI Components
│   │   │   ├── Header.tsx       # Navigation + Auth modals
│   │   │   ├── Chatbot.tsx      # AI Chatbot with TTS
│   │   │   ├── FeaturedVendors.tsx  # Vendor cards + booking
│   │   │   └── ui/             # shadcn/ui components (30+)
│   │   ├── pages/
│   │   │   ├── Index.tsx        # Main landing page
│   │   │   └── AdminDashboard.tsx
│   │   ├── lib/utils.ts         # Utility functions
│   │   └── hooks/               # Custom React hooks
│   ├── .env                     # API keys (EmailJS, Razorpay, Gemini)
│   └── package.json
│
├── backend/                     # Spring Boot + Maven
│   ├── src/main/java/com/shaadi/connect/
│   │   ├── config/
│   │   │   └── SecurityConfig.java    # Spring Security + CORS
│   │   ├── controller/
│   │   │   ├── AuthController.java    # Login/Signup/Reset
│   │   │   ├── VendorController.java  # Vendor CRUD
│   │   │   ├── PaymentController.java # Razorpay integration
│   │   │   ├── HoneymoonController.java # AI planner
│   │   │   └── AdminController.java   # Dashboard stats
│   │   ├── model/
│   │   │   ├── User.java             # User entity
│   │   │   ├── Vendor.java           # Vendor entity
│   │   │   ├── Booking.java          # Booking entity
│   │   │   └── PaymentTransaction.java
│   │   ├── repository/               # JPA Repositories
│   │   ├── service/                   # Business logic
│   │   │   ├── UserService.java
│   │   │   ├── EmailService.java
│   │   │   └── GeminiService.java
│   │   ├── security/
│   │   │   ├── JwtUtil.java          # Token generation/validation
│   │   │   └── JwtFilter.java        # Request interceptor
│   │   └── dto/                       # Request/Response DTOs
│   ├── src/main/resources/
│   │   └── application.yml           # App configuration
│   └── pom.xml
```

---

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(10),
    city VARCHAR(100),
    occupation VARCHAR(100),
    education VARCHAR(100),
    religion VARCHAR(50),
    mother_tongue VARCHAR(50),
    security_answer VARCHAR(255),
    role ENUM('ROLE_USER', 'ROLE_ADMIN'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Vendors Table
CREATE TABLE vendors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    service VARCHAR(100),
    category VARCHAR(100),
    location VARCHAR(255),
    description TEXT,
    contact VARCHAR(100),
    rating DOUBLE,
    price DOUBLE,
    image_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vendor_id BIGINT REFERENCES vendors(id),
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(15),
    event_date DATE,
    event_time TIME,
    deposit_amount DOUBLE,
    payment_method VARCHAR(50),
    upi_id VARCHAR(100),
    payment_id VARCHAR(255),
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
    purpose TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Payment Transactions Table
CREATE TABLE payment_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(255),
    payment_id VARCHAR(255),
    signature VARCHAR(255),
    amount DOUBLE,
    currency VARCHAR(10),
    status ENUM('PENDING', 'VERIFIED', 'FAILED'),
    purpose TEXT,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    verified_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/signup` | Public | User registration |
| POST | `/api/login` | Public | User login, returns JWT |
| GET | `/api/verify-token` | Token | Validate JWT token |
| POST | `/api/verify-security-answer` | Public | Verify security answer |
| POST | `/api/reset-password` | Public | Reset password |
| GET | `/api/vendors` | Token | List all vendors |
| GET | `/api/vendors/{id}` | Token | Get vendor details |
| POST | `/api/vendors` | Admin | Add new vendor |
| DELETE | `/api/vendors/{id}` | Admin | Delete vendor |
| POST | `/api/create-order` | Public | Create Razorpay order |
| POST | `/api/verify-payment` | Token | Verify payment signature |
| GET | `/api/razorpay-key` | Public | Get Razorpay public key |
| POST | `/api/plan-honeymoon` | Token | AI honeymoon planning |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/health` | Public | Health check |

---

## How to Run the Project

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup
```bash
cd backend
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE shaadi_connect;"

# Update application.yml with your credentials
# Run the application
mvn spring-boot:run
# Server starts at http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with API keys
npm run dev
# App starts at http://localhost:5173
```

---

## Interview Explanation Script

### "Tell me about your project"

> "I built **Shaadi Connect**, a full-stack wedding planning platform using React with TypeScript on the frontend and Spring Boot on the backend. The platform lets couples discover and book verified wedding vendors, make secure payments via Razorpay, get AI-powered wedding advice through a chatbot built with Google Gemini, and plan honeymoons with an AI itinerary generator. I implemented JWT-based authentication, role-based access control for admin features, and integrated multiple third-party APIs including Razorpay for payments, Google Gemini for AI, and ElevenLabs for text-to-speech."

### "What was your role?"

> "I was the sole developer — I designed the database schema, built the REST APIs with Spring Boot, implemented the security layer with JWT, integrated third-party services (Razorpay, Gemini AI, ElevenLabs), and built the entire React frontend with TypeScript. I also handled deployment configuration and environment management."

### "Why this tech stack?"

> "I chose React + TypeScript for type safety and component reusability, Vite for fast dev experience, and Tailwind CSS for rapid UI development. On the backend, Spring Boot gives enterprise-grade security, JPA simplifies database operations, and the ecosystem has mature libraries for payment gateways and email services. MySQL was chosen for relational data integrity — wedding bookings involve multiple related entities."

### "What would you improve?"

> "I'd add WebSocket-based real-time notifications for booking status updates, implement Redis caching for vendor listings, add image upload to cloud storage (S3/Cloudinary) instead of URL-based images, write comprehensive unit and integration tests, and containerize with Docker for easier deployment."

---

## Technologies & Libraries Used

### Frontend
| Library | Purpose |
|---------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router DOM | Client-side routing |
| TanStack React Query | Server state management |
| react-hook-form + zod | Form handling & validation |
| shadcn/ui (Radix UI) | Accessible UI components |
| axios | HTTP client |
| EmailJS | Client-side email |
| Razorpay SDK | Payment checkout |
| Recharts | Data visualization |
| lucide-react | Icons |
| next-themes | Dark/light mode |

### Backend
| Library | Purpose |
|---------|---------|
| Spring Boot 3.3.5 | Application framework |
| Spring Security | Authentication & authorization |
| Spring Data JPA | Database ORM |
| jjwt 0.12.6 | JWT token handling |
| MySQL Connector | Database driver |
| Spring Mail | Email notifications |
| Lombok | Boilerplate reduction |
| BCrypt | Password hashing |

### External APIs
| API | Purpose |
|-----|---------|
| Google Gemini 2.0 Flash | AI chatbot & honeymoon planner |
| Razorpay | Payment processing |
| ElevenLabs | Text-to-speech |
| EmailJS | Browser-based email |
| Web Speech API | TTS fallback |
| Geolocation API | Location-based recommendations |

---

## Security Measures Implemented

1. **Password Hashing** — BCrypt with salt rounds
2. **JWT Tokens** — HMAC SHA-256 signed, 24hr expiry
3. **CORS Configuration** — Whitelisted origins only
4. **Input Validation** — Zod (frontend) + @Valid (backend)
5. **Payment Verification** — HMAC signature validation for Razorpay
6. **Security Questions** — Encrypted answers for password recovery
7. **Role-Based Access** — Admin endpoints protected
8. **Stateless Sessions** — No server-side session storage
9. **CSRF Disabled** — Appropriate for JWT-based APIs
10. **Environment Variables** — Secrets stored in .env files, not in code

---

*Built with React + Spring Boot | Shaadi Connect 2024*
