-- V2__create_vehicles.sql: Create vehicles and vehicle images tables
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturing_year INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    passenger_capacity INT NOT NULL,
    luggage_capacity INT NOT NULL,
    transmission VARCHAR(30) NOT NULL,
    fuel_type VARCHAR(30) NOT NULL,
    daily_rate DECIMAL(12, 2) NOT NULL,
    listing_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    primary_image_url VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_vehicles_category (category),
    INDEX idx_vehicles_status (listing_status),
    INDEX idx_vehicles_daily_rate (daily_rate),
    INDEX idx_vehicles_capacity (passenger_capacity),
    INDEX idx_vehicles_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vehicle_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vehicle_images_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicle_images_order (vehicle_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

