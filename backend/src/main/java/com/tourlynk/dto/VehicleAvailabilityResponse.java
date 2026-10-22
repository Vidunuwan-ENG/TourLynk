package com.tourlynk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VehicleAvailabilityResponse {
    private Long vehicleId;
    private boolean available;
    private String status; // "Available", "Booked", "Maintenance", "Unavailable"
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Integer totalDays;
    private BigDecimal dailyRate;
    private BigDecimal subtotal;
    private BigDecimal totalAmount;
    private String currency = "LKR";
    private String message;

    public VehicleAvailabilityResponse() {}

    public VehicleAvailabilityResponse(Long vehicleId, boolean available, String status, String message) {
        this.vehicleId = vehicleId;
        this.available = available;
        this.status = status;
        this.message = message;
    }

    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }

    public LocalDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(LocalDateTime endDateTime) { this.endDateTime = endDateTime; }

    public Integer getTotalDays() { return totalDays; }
    public void setTotalDays(Integer totalDays) { this.totalDays = totalDays; }

    public BigDecimal getDailyRate() { return dailyRate; }
    public void setDailyRate(BigDecimal dailyRate) { this.dailyRate = dailyRate; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}

