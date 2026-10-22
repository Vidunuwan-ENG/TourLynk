package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.PagedResponse;
import com.tourlynk.dto.VehicleAvailabilityResponse;
import com.tourlynk.dto.VehicleDto;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.AvailabilityEngine;
import com.tourlynk.service.VehicleService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;
    private final AvailabilityEngine availabilityEngine;

    public VehicleController(VehicleService vehicleService, AvailabilityEngine availabilityEngine) {
        this.vehicleService = vehicleService;
        this.availabilityEngine = availabilityEngine;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<VehicleDto>>> getVehicles(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minPassengers,
            @RequestParam(required = false) String transmission,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;

        PagedResponse<VehicleDto> response = vehicleService.getVehicles(
                category, minPrice, maxPrice, minPassengers, transmission, fuelType, search,
                startDateTime, endDateTime, sortBy, sortDir, page, size, userId);

        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<VehicleDto>>> getPopularVehicles(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        List<VehicleDto> popular = vehicleService.getPopularVehicles(userId);
        return ResponseEntity.ok(ApiResponse.ok(popular));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> getVehicleById(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        VehicleDto dto = vehicleService.getVehicleById(id, userId, startDateTime, endDateTime);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<VehicleAvailabilityResponse>> checkVehicleAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDateTime) {
        VehicleAvailabilityResponse response = availabilityEngine.checkAvailability(id, startDateTime, endDateTime);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}

