package com.tourlynk.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public class VehicleCreateRequest {

    @NotBlank(message = "Make is required")
    private String make;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Manufacturing year is required")
    @Min(value = 2000, message = "Year must be 2000 or newer")
    @Max(value = 2030, message = "Year is invalid")
    private Integer manufacturingYear;

    @NotBlank(message = "Category is required")
    private String category; // Car, SUV, Van, Compact, Luxury

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotNull(message = "Passenger capacity is required")
    @Min(value = 1, message = "At least 1 passenger")
    private Integer passengerCapacity;

    @NotNull(message = "Luggage capacity is required")
    @Min(value = 0, message = "Luggage capacity must be positive")
    private Integer luggageCapacity;

    @NotBlank(message = "Transmission is required")
    private String transmission; // Automatic, Manual, Auto

    @NotBlank(message = "Fuel type is required")
    private String fuelType; // Petrol, Diesel, Hybrid, Electric

    @NotNull(message = "Daily rate is required")
    @DecimalMin(value = "500.00", message = "Daily rate must be at least 500 LKR")
    private BigDecimal dailyRate;

    private String listingStatus = "AVAILABLE";

    @NotBlank(message = "Primary image URL is required")
    private String primaryImageUrl;

    private List<String> additionalImages;

    public VehicleCreateRequest() {}

    // Getters and Setters
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

    public List<String> getAdditionalImages() { return additionalImages; }
    public void setAdditionalImages(List<String> additionalImages) { this.additionalImages = additionalImages; }
}

