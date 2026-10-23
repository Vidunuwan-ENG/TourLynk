package com.tourlynk.controller;

import com.tourlynk.dto.*;
import com.tourlynk.service.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminDashboardService dashboardService;
    private final VehicleService vehicleService;
    private final BookingService bookingService;
    private final DestinationService destinationService;
    private final MaintenanceService maintenanceService;
    private final ContactService contactService;

    public AdminController(AdminDashboardService dashboardService,
                           VehicleService vehicleService,
                           BookingService bookingService,
                           DestinationService destinationService,
                           MaintenanceService maintenanceService,
                           ContactService contactService) {
        this.dashboardService = dashboardService;
        this.vehicleService = vehicleService;
        this.bookingService = bookingService;
        this.destinationService = destinationService;
        this.maintenanceService = maintenanceService;
        this.contactService = contactService;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }

    // Vehicle Management
    @GetMapping("/vehicles")
    public ResponseEntity<ApiResponse<PagedResponse<VehicleDto>>> getVehicles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<VehicleDto> vehicles = vehicleService.getVehicles(
                null, null, null, null, null, null, null, null, null, "id", "asc", page, size, null);
        return ResponseEntity.ok(ApiResponse.ok(vehicles));
    }

    @PostMapping("/vehicles")
    public ResponseEntity<ApiResponse<VehicleDto>> createVehicle(@Valid @RequestBody VehicleCreateRequest request) {
        VehicleDto created = vehicleService.createVehicle(request);
        return new ResponseEntity<>(ApiResponse.ok("Vehicle created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<ApiResponse<VehicleDto>> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleUpdateRequest request) {
        VehicleDto updated = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle updated successfully", updated));
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<ApiResponse<String>> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle archived successfully", "Archived"));
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        PagedResponse<BookingResponse> bookings = bookingService.adminGetAllBookings(pageable);
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        BookingResponse updated = bookingService.adminUpdateBookingStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated", updated));
    }

    // Destination Management
    @PostMapping("/destinations")
    public ResponseEntity<ApiResponse<DestinationDto>> createDestination(@Valid @RequestBody DestinationCreateRequest request) {
        DestinationDto created = destinationService.createDestination(request);
        return new ResponseEntity<>(ApiResponse.ok("Destination created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<ApiResponse<DestinationDto>> updateDestination(
            @PathVariable Long id,
            @Valid @RequestBody DestinationUpdateRequest request) {
        DestinationDto updated = destinationService.updateDestination(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Destination updated successfully", updated));
    }

    // Maintenance Management
    @GetMapping("/maintenance")
    public ResponseEntity<ApiResponse<List<VehicleMaintenanceDto>>> getAllMaintenance() {
        List<VehicleMaintenanceDto> list = maintenanceService.getAllMaintenance();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/maintenance")
    public ResponseEntity<ApiResponse<VehicleMaintenanceDto>> createMaintenance(
            @Valid @RequestBody MaintenanceCreateRequest request) {
        VehicleMaintenanceDto created = maintenanceService.createMaintenance(request);
        return new ResponseEntity<>(ApiResponse.ok("Maintenance scheduled successfully", created), HttpStatus.CREATED);
    }

    @DeleteMapping("/maintenance/{id}")
    public ResponseEntity<ApiResponse<String>> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok(ApiResponse.ok("Maintenance deleted successfully", "Deleted"));
    }

    // Contact Messages
    @GetMapping("/contact-messages")
    public ResponseEntity<ApiResponse<PagedResponse<ContactMessageResponse>>> getContactMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<ContactMessageResponse> messages = contactService.getMessages(pageable);
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    @PutMapping("/contact-messages/{id}/read")
    public ResponseEntity<ApiResponse<String>> markMessageAsRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Message marked as read", "Read"));
    }
}

