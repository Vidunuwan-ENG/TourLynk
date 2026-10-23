package com.tourlynk.dto;

import java.time.LocalDateTime;

public class FavoriteDto {
    private Long id;
    private Long userId;
    private VehicleDto vehicle;
    private LocalDateTime createdAt;

    public FavoriteDto() {}

    public FavoriteDto(Long id, Long userId, VehicleDto vehicle, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.vehicle = vehicle;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public VehicleDto getVehicle() { return vehicle; }
    public void setVehicle(VehicleDto vehicle) { this.vehicle = vehicle; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

