# TourLynk Database Documentation

This directory contains the database design artifacts, Flyway SQL migrations, and sample seed data for TourLynk.

## Directory Structure
- `migrations/`: Numbered Flyway SQL migration scripts (V1 through V6).
- `seed/`: Initial development seed data (`sample_data.sql`) containing:
  - All 25 Sri Lankan administrative districts.
  - Initial system administrator and test tourist accounts.
  - 12 comprehensive vehicles across classes (Sedans, SUVs, Vans, Compacts, Luxury).
  - 25 top Sri Lankan tourist destinations with accurate GPS coordinates.
  - Sample bookings and maintenance windows to test all availability states.
- `documentation/`:
  - `erd.md`: Mermaid Entity-Relationship diagram.
  - `database_design.md`: In-depth normalization and concurrency control notes.

## Execution
Flyway automatically runs migrations from `backend/src/main/resources/db/migration/` upon Spring Boot startup. You can also manually apply these scripts to any standard MySQL 8.0 instance:
```bash
mysql -u root -p tourlynk_db < migrations/V1__create_users.sql
mysql -u root -p tourlynk_db < migrations/V2__create_vehicles.sql
mysql -u root -p tourlynk_db < migrations/V3__create_destinations.sql
mysql -u root -p tourlynk_db < migrations/V4__create_bookings.sql
mysql -u root -p tourlynk_db < migrations/V5__create_reviews_and_favorites.sql
mysql -u root -p tourlynk_db < migrations/V6__create_supporting_tables.sql
mysql -u root -p tourlynk_db < seed/sample_data.sql
```

