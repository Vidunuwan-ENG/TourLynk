package com.tourlynk.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String make;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(name = "manufacturing_year", nullable = false)
    private Integer manufacturingYear;

    @Column(nullable = false, length = 50)
    private String category; // Car, SUV, Van, Compact, Luxury

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "registration_number", nullable = false, unique = true, length = 50)
    private String registrationNumber;

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(name = "luggage_capacity", nullable = false)
    private Integer luggageCapacity;

    @Column(nullable = false, length = 30)
    private String transmission; // Automatic, Manual, Auto

    @Column(name = "fuel_type", nullable = false, length = 30)
    private String fuelType; // Petrol, Diesel, Hybrid, Electric

    @Column(name = "daily_rate", nullable = false, precision = 12, scale = 2)
    private BigDecimal dailyRate;

    @Column(name = "listing_status", nullable = false, length = 30)
    private String listingStatus = "AVAILABLE"; // AVAILABLE, MAINTENANCE, UNAVAILABLE, ARCHIVED

    @Column(name = "primary_image_url", nullable = false, length = 500)
    private String primaryImageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<VehicleImage> images = new ArrayList<>();

    public Vehicle() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addImage(VehicleImage image) {
        images.add(image);
        image.setVehicle(this);
    }

    public void removeImage(VehicleImage image) {
        images.remove(image);
        image.setVehicle(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getManufacturingYear() { return manufacturingYear; }
    public void setManufacturingYear(Integer manufacturingYear) { this.manufacturingYear = manufacturingYear; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public Integer getPassengerCapacity() { return passengerCapacity; }
    public void setPassengerCapacity(Integer passengerCapacity) { this.passengerCapacity = passengerCapacity; }

    public Integer getLuggageCapacity() { return luggageCapacity; }
    public void setLuggageCapacity(Integer luggageCapacity) { this.luggageCapacity = luggageCapacity; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }

    public String getListingStatus() { return listingStatus; }
    public void setListingStatus(String listingStatus) { this.listingStatus = listingStatus; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }

    public List<VehicleImage> getImages() { return images; }
    public void setImages(List<VehicleImage> images) { this.images = images; }
}

