# TourLynk Database Architecture and Design

## Overview
TourLynk uses MySQL 8.0 with InnoDB engine and `utf8mb4_unicode_ci` collation, providing full Unicode support for multi-language content including Sinhala, Tamil, and English. The database is strictly normalized (3NF) to guarantee referential integrity and zero redundant anomaly propagation.

## Schema Versioning with Flyway
Schema versions are strictly numbered:
- `V1__create_users.sql`: Authentication, authorization roles (USER, ADMIN), account statuses.
- `V2__create_vehicles.sql`: Fleet definitions, capacity, transmission, pricing, image galleries.
- `V3__create_destinations.sql`: Administrative districts, geographical coordinates, tourist spots.
- `V4__create_bookings.sql`: Reservation intervals, monetary calculation snapshots (DECIMAL 12,2), status transitions.
- `V5__create_reviews_and_favorites.sql`: User feedback on vehicles/destinations, user favorite lists.
- `V6__create_supporting_tables.sql`: Fleet maintenance blackout scheduling, customer contact submissions.

## Booking & Availability Concurrency Rules
1. **Half-Open Intervals**: Reservations follow `[start_datetime, end_datetime)` intervals. A booking ending at 10:00 does not conflict with one starting at 10:00.
2. **Conflict Overlap Condition**: Two intervals `[S1, E1)` and `[S2, E2)` overlap if and only if:
   `S1 < E2 AND E1 > S2`.
3. **Blocking Statuses**: Only `CONFIRMED` and active `PENDING` reservations block availability. `CANCELLED` and historical `COMPLETED` bookings do NOT block availability.
4. **Maintenance Windows**: Active records in `vehicle_maintenance` with status `SCHEDULED` or `IN_PROGRESS` block rental bookings during their date range.
5. **Atomic Concurrency Control**: Backend uses transactional isolation and explicit locking (`SELECT FOR UPDATE` / pessimistic locking) to prevent double bookings during high concurrency.

