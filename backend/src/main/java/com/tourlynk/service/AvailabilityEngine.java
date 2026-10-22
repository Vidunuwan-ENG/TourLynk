package com.tourlynk.service;

import com.tourlynk.dto.VehicleAvailabilityResponse;
import com.tourlynk.entity.Booking;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.entity.VehicleMaintenance;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.BookingRepository;
import com.tourlynk.repository.VehicleMaintenanceRepository;
import com.tourlynk.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AvailabilityEngine {

    private static final List<String> BLOCKING_BOOKING_STATUSES = Arrays.asList("CONFIRMED", "PENDING");
    private static final List<String> BLOCKING_MAINTENANCE_STATUSES = Arrays.asList("SCHEDULED", "IN_PROGRESS");

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final VehicleMaintenanceRepository maintenanceRepository;

    public AvailabilityEngine(VehicleRepository vehicleRepository,
                              BookingRepository bookingRepository,
                              VehicleMaintenanceRepository maintenanceRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    /**
     * Checks if a vehicle is available for a given half-open interval [startDateTime, endDateTime).
     */
    @Transactional(readOnly = true)
    public VehicleAvailabilityResponse checkAvailability(Long vehicleId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        validateInterval(startDateTime, endDateTime);

        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + vehicleId));

        int totalDays = calculateRentalDays(startDateTime, endDateTime);
        BigDecimal subtotal = vehicle.getDailyRate().multiply(BigDecimal.valueOf(totalDays));

        VehicleAvailabilityResponse response = new VehicleAvailabilityResponse();
        response.setVehicleId(vehicle.getId());
        response.setStartDateTime(startDateTime);
        response.setEndDateTime(endDateTime);
        response.setTotalDays(totalDays);
        response.setDailyRate(vehicle.getDailyRate());
        response.setSubtotal(subtotal);
        response.setTotalAmount(subtotal);
        response.setCurrency("LKR");

        // 1. Check base listing status
        if (!"AVAILABLE".equalsIgnoreCase(vehicle.getListingStatus())) {
            response.setAvailable(false);
            response.setStatus(vehicle.getListingStatus());
            response.setMessage("Vehicle is currently under " + vehicle.getListingStatus().toLowerCase() + " status.");
            return response;
        }

        // 2. Check maintenance conflicts
        List<VehicleMaintenance> maintenanceConflicts = maintenanceRepository.findConflictingMaintenance(
                vehicleId, startDateTime, endDateTime, BLOCKING_MAINTENANCE_STATUSES);

        if (!maintenanceConflicts.isEmpty()) {
            response.setAvailable(false);
            response.setStatus("Maintenance");
            response.setMessage("Vehicle is scheduled for maintenance during the selected dates.");
            return response;
        }

        // 3. Check conflicting bookings
        List<Booking> bookingConflicts = bookingRepository.findConflictingBookings(
                vehicleId, startDateTime, endDateTime, BLOCKING_BOOKING_STATUSES);

        if (!bookingConflicts.isEmpty()) {
            response.setAvailable(false);
            response.setStatus("Booked");
            response.setMessage("Vehicle is already booked for the selected date range.");
            return response;
        }

        // Vehicle is fully available
        response.setAvailable(true);
        response.setStatus("Available");
        response.setMessage("Vehicle is available for the selected dates.");
        return response;
    }

    /**
     * Calculates the billable days for a given date range.
     * Minimum billable duration is 1 day.
     */
    public int calculateRentalDays(LocalDateTime start, LocalDateTime end) {
        long hours = Duration.between(start, end).toHours();
        if (hours <= 24) {
            return 1;
        }
        return (int) Math.ceil((double) hours / 24.0);
    }

    public void validateInterval(LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime == null || endDateTime == null) {
            throw new BadRequestException("Both start date and end date must be provided.");
        }
        if (!endDateTime.isAfter(startDateTime)) {
            throw new BadRequestException("Rental end date and time must be after start date and time.");
        }
        if (startDateTime.isBefore(LocalDateTime.now().minusMinutes(30))) {
            throw new BadRequestException("Rental start time cannot be in the past.");
        }
    }
}

