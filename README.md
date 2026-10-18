# TourLynk — Full-Stack Vehicle Rental & Sri Lanka Tourism Platform

> **Discover More. Travel Better.**  
> A production-grade, full-stack vehicle rental and tourism application engineered specifically for exploring the island of Sri Lanka.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Flyway](https://img.shields.io/badge/Flyway-10-red.svg)](https://flywaydb.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)

---

## 1. Executive Summary & Visual Identity

**TourLynk** is an end-to-end self-drive vehicle rental and tourism discovery platform. It faithfully translates the cinematic visual reference design featuring:
- **Cinematic Sri Lankan Hero Banner**: Showcasing central highland mountain roads, pristine lake scenery, and modern touring SUVs.
- **Color Palette**: Deep TourLynk Navy (`#0B252C`), Deep Teal (`#0B3B3C` / `#0E4D52`), Golden Accent (`#F5B041` / `#E5A93C`), and Clean Off-White background surfaces (`#F8FAFB`).
- **Interactive Sri Lanka Map**: Real-time Leaflet & OpenStreetMap rendering of all 25 Sri Lankan districts with photo thumbnail pins and live selection previews.
- **Fleet Card Grid**: 4-column responsive layout matching the UI design with seating, luggage, transmission specs, daily pricing in Sri Lankan Rupees (LKR), and instant booking.
- **Zero Legacy Brand References**: Strictly unified under the **TourLynk** brand identity.

---

## 2. Architecture & Project Directory Structure

TourLynk follows a clean 3-tier architecture with strictly decoupled frontend, backend, and database repositories:

```text
TourLynk/
├── database/                    # Database migrations & schemas
│   ├── migrations/              # Flyway versioned SQL migrations (V1 to V6)
│   │   ├── V1__create_users.sql
│   │   ├── V2__create_vehicles.sql
│   │   ├── V3__create_destinations.sql
│   │   ├── V4__create_bookings.sql
│   │   ├── V5__create_reviews_and_favorites.sql
│   │   └── V6__create_supporting_tables.sql
│   ├── seed/
│   │   └── sample_data.sql      # Complete seed data for 25 districts, vehicles, destinations
│   ├── documentation/
│   │   ├── database_design.md   # Relational schema specification & normalization rules
│   │   └── erd.md               # Entity-Relationship diagram in Mermaid
│   └── README.md
│
├── backend/                     # Java 21 / Spring Boot 3.3.5 REST API
│   ├── src/
│   │   ├── main/java/com/tourlynk/
│   │   │   ├── config/          # Security, JWT, CORS, WebMvc, DataSeedRunner
│   │   │   ├── controller/      # Auth, Vehicles, Bookings, Destinations, Admin, Contact
│   │   │   ├── dto/             # Strongly typed request/response transfer objects
│   │   │   ├── entity/          # 11 JPA entity models with relational mappings
│   │   │   ├── exception/       # Global exception handler & custom exceptions
│   │   │   ├── repository/      # Spring Data JPA repositories with pessimistic locking
│   │   │   ├── security/        # JWT filter, UserPrincipal, CustomUserDetailsService
│   │   │   ├── service/         # AvailabilityEngine, BookingService, RoutingService, etc.
│   │   │   └── TourLynkApplication.java
│   │   └── test/                # JUnit 5, Mockito & SpringBoot test suites
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                    # React 18 / Vite / TypeScript / Tailwind CSS
│   ├── src/
│   │   ├── assets/logo/         # SVG Vector TourLynk Brandmark & Logo
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Badge, LoadingSkeleton
│   │   │   ├── destinations/    # DestinationCard
│   │   │   ├── layout/          # Footer
│   │   │   ├── maps/            # SriLankaMap (Leaflet)
│   │   │   ├── navigation/      # Navbar
│   │   │   └── vehicles/        # VehicleCard
│   │   ├── contexts/            # AuthContext (JWT persistence, user state)
│   │   ├── pages/               # Routed view pages
│   │   │   ├── home/            # HomePage (Matching UI Reference)
│   │   │   ├── vehicles/        # VehiclesPage, VehicleDetailPage
│   │   │   ├── destinations/    # DestinationsPage, DestinationDetailPage
│   │   │   ├── bookings/        # MyBookingsPage (User reservation manager)
│   │   │   ├── account/         # ProfilePage (User settings & saved vehicles)
│   │   │   ├── admin/           # AdminDashboardPage (Fleet, Bookings, Maintenance, CRM)
│   │   │   ├── about/           # AboutPage
│   │   │   ├── contact/         # ContactPage (Working contact form & FAQs)
│   │   │   └── auth/            # LoginPage, RegisterPage
│   │   ├── services/            # Axios API clients for all backend endpoints
│   │   ├── styles/              # Tailwind CSS directives & Leaflet styling
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # React Router configuration
│   │   └── main.tsx             # Application bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml           # Multi-container orchestration (MySQL, Backend, Frontend)
├── .gitignore
└── README.md                    # Comprehensive platform documentation
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with Vite 5 and TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom TourLynk design tokens
- **Maps**: Leaflet 1.9 & React-Leaflet with OpenStreetMap tiles and custom photo thumbnail markers
- **Icons**: Lucide React
- **HTTP Client**: Axios with automatic JWT Authorization header injection and 401 interceptors
- **Routing**: React Router DOM 6 with protected routes and role checks

### Backend
- **Platform**: Java 21 LTS
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security with stateless JWT (JSON Web Tokens) and BCrypt password hashing
- **Persistence**: Spring Data JPA & Hibernate 6.5
- **Database Migrations**: Flyway Migration Engine
- **Health Checks**: Spring Boot Actuator (`/actuator/health`)
- **Routing Engine**: OSRM (Open Source Routing Machine) driving distance calculation with Haversine geodesic fallback
- **Testing**: JUnit 5, Mockito, AssertJ, H2 in-memory test database

### Database
- **Engine**: MySQL 8.0 Server
- **Collation**: `utf8mb4_unicode_ci`
- **Integrity**: Foreign keys, unique constraints on emails, registrations, slugs, and composite unique indices on favorites

---

## 4. Key Business Logic & Engineering Highlights

### 1. Robust Vehicle Availability Engine
The application prevents double-booking using **Half-Open Interval Collision Detection**:
$$\text{Overlap} \iff \text{existing.start} < \text{requested.end} \land \text{existing.end} > \text{requested.start}$$
- Blocks both `CONFIRMED` and `PENDING` bookings within the requested dates.
- Blocks scheduled vehicle maintenance periods (`SCHEDULED`, `IN_PROGRESS`).
- Employs **Pessimistic Locking** (`SELECT ... FOR UPDATE` via `findByIdForUpdate`) during booking checkout to prevent race conditions during concurrent booking requests.

### 2. Sri Lankan Route & Distance Calculator
- Calls `/api/v1/destinations/{slug}/directions?userLat=...&userLng=...`.
- Resolves precise driving distance (in kilometers) and driving duration (in hours/minutes) via OSRM.
- If the routing provider is unreachable, seamlessly calculates Great Circle distance via the Haversine formula and estimates driving duration assuming a 45 km/h average Sri Lankan road speed.
- Generates a 1-click external navigation link to Google Maps.

### 3. Comprehensive Admin Dashboard
- Live KPI cards derived directly from database aggregations: total vehicles, available count, confirmed bookings, registered users, and active maintenance windows.
- Vehicle CRUD with modal management (specs, category, daily rate, status).
- Booking approval and status transition pipeline (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `COMPLETED`).
- Maintenance window scheduler that automatically blocks out vehicle availability dates.
- Customer inquiry viewer with one-click "Mark as Read".

---

## 5. Pre-Seeded Demo Credentials

The database comes pre-seeded with sample user accounts (all passwords hashed with BCrypt):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@tourlynk.com` | `Admin123!` | Full Admin Console, Fleet CRUD, Booking Management, Maintenance, Inquiries |
| **Registered User** | `user@tourlynk.com` | `User123!` | Search, Filter, Book Vehicles, Manage Reservations, Save Favorites, Write Reviews |

> **Tip**: The Login screen features 1-click **Quick Demo Fill** buttons to populate these credentials instantly.

---

## 6. Quick Start & Installation

### Option A: Running with Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed and running.
2. In the project root, execute:
   ```bash
   docker compose up --build
   ```
3. Access the applications:
   - **Frontend UI**: [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000))
   - **Backend REST API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
   - **Actuator Health Check**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

### Option B: Running Locally (Windows / macOS / Linux)

#### 1. Database Setup (MySQL 8.0)
1. Start your local MySQL service.
2. Open MySQL CLI or MySQL Workbench:
   ```sql
   CREATE DATABASE tourlynk_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'tourlynk'@'localhost' IDENTIFIED BY 'tourlynk_pass';
   GRANT ALL PRIVILEGES ON tourlynk_db.* TO 'tourlynk'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. Seed the sample dataset (25 districts, 12 vehicles, 25 destinations, bookings):
   ```bash
   mysql -u tourlynk -ptourlynk_pass tourlynk_db < database/seed/sample_data.sql
   ```
   *(Alternatively, Flyway migrations and `DataSeedRunner` will automatically seed a blank database on backend startup).*

#### 2. Backend Setup (Spring Boot)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Verify or override environment variables in `src/main/resources/application.properties` (or set OS environment variables):
   - `SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/tourlynk_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Colombo`
   - `SPRING_DATASOURCE_USERNAME=tourlynk`
   - `SPRING_DATASOURCE_PASSWORD=tourlynk_pass`
3. Compile, test, and run the backend:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on port `8080` at `http://localhost:8080/api/v1`.

#### 3. Frontend Setup (React & Vite)
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 7. REST API Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | Public | Register a new user account |
| **POST** | `/api/v1/auth/login` | Public | Authenticate and obtain JWT token |
| **GET** | `/api/v1/auth/me` | Authenticated | Retrieve authenticated user profile |
| **PUT** | `/api/v1/users/me` | Authenticated | Update user profile and password |
| **GET** | `/api/v1/vehicles` | Public | Paginated list with category, price, date filters |
| **GET** | `/api/v1/vehicles/popular` | Public | Top 4 featured vehicles matching reference UI |
| **GET** | `/api/v1/vehicles/{id}` | Public | Detailed vehicle specifications & image gallery |
| **GET** | `/api/v1/vehicles/{id}/availability` | Public | Validate date availability & compute price breakdown |
| **GET** | `/api/v1/destinations` | Public | Destinations list with category & district filter |
| **GET** | `/api/v1/destinations/districts` | Public | All 25 Sri Lankan districts with count |
| **GET** | `/api/v1/destinations/popular` | Public | Top 4 destinations matching reference UI |
| **GET** | `/api/v1/destinations/{slug}` | Public | Full destination travel guide |
| **GET** | `/api/v1/destinations/{slug}/directions` | Public | OSRM driving distance & duration calculation |
| **POST** | `/api/v1/destinations/{slug}/reviews` | Authenticated | Post review with star rating |
| **POST** | `/api/v1/bookings` | Authenticated | Reserve a vehicle (with collision validation) |
| **GET** | `/api/v1/bookings/me` | Authenticated | Retrieve current user's booking history |
| **POST** | `/api/v1/bookings/{id}/cancel` | Authenticated | Cancel a pending or confirmed reservation |
| **GET** | `/api/v1/favorites` | Authenticated | List bookmarked vehicles |
| **POST** | `/api/v1/favorites/{vehicleId}` | Authenticated | Bookmark a vehicle |
| **DELETE** | `/api/v1/favorites/{vehicleId}` | Authenticated | Remove vehicle from bookmarks |
| **POST** | `/api/v1/contact` | Public | Submit contact message / inquiry |
| **GET** | `/api/v1/admin/dashboard/summary` | Admin | Aggregate dashboard KPIs and recent bookings |
| **GET** | `/api/v1/admin/vehicles` | Admin | Complete fleet inventory table |
| **POST** | `/api/v1/admin/vehicles` | Admin | Add new vehicle to fleet |
| **PUT** | `/api/v1/admin/vehicles/{id}` | Admin | Edit vehicle details and status |
| **DELETE** | `/api/v1/admin/vehicles/{id}` | Admin | Delete or archive vehicle |
| **GET** | `/api/v1/admin/bookings` | Admin | View all system reservations |
| **PUT** | `/api/v1/admin/bookings/{id}/status` | Admin | Approve, reject, or complete a booking |
| **GET** | `/api/v1/admin/maintenance` | Admin | View scheduled maintenance windows |
| **POST** | `/api/v1/admin/maintenance` | Admin | Block vehicle dates for maintenance |
| **DELETE** | `/api/v1/admin/maintenance/{id}` | Admin | Remove maintenance window |
| **GET** | `/api/v1/admin/contact-messages` | Admin | View customer inquiry messages |

---

## 8. Verification & Test Execution

### Backend Automated Tests
To run the automated test suite:
```bash
cd backend
mvn test
```
**Results Summary**:
```text
[INFO] Running com.tourlynk.service.AvailabilityEngineTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0 -- in com.tourlynk.service.AvailabilityEngineTest
[INFO] Running com.tourlynk.service.BookingServiceTest
[INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0 -- in com.tourlynk.service.BookingServiceTest
[INFO] Running com.tourlynk.TourLynkApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in com.tourlynk.TourLynkApplicationTests
[INFO] Results: Tests run: 10, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Build Verification
To verify the frontend TypeScript and production Vite bundling:
```bash
cd frontend
npm run build
```
**Results Summary**:
```text
✓ 1700 modules transformed.
dist/index.html                   1.34 kB │ gzip:   0.74 kB
dist/assets/index-PItozK8_.css   63.94 kB │ gzip:  14.73 kB
dist/assets/index-ZXzMFO75.js   567.56 kB │ gzip: 159.78 kB
✓ built in 27.05s
```

---

## 9. License & Brand Attribution
Designed and built for **TourLynk** — Discover More. Travel Better.  
All brand assets, photography references, and software modules are configured for production deployment.
