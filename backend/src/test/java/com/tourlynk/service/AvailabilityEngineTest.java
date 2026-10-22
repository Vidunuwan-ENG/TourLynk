package com.tourlynk.service;

import com.tourlynk.dto.VehicleAvailabilityResponse;
import com.tourlynk.entity.Booking;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.entity.VehicleMaintenance;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.repository.BookingRepository;
import com.tourlynk.repository.VehicleMaintenanceRepository;
import com.tourlynk.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AvailabilityEngineTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private VehicleMaintenanceRepository maintenanceRepository;

    @InjectMocks
    private AvailabilityEngine availabilityEngine;

    private Vehicle sampleVehicle;

    @BeforeEach
    void setUp() {
        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setMake("Toyota");
        sampleVehicle.setModel("Axio");
        sampleVehicle.setDailyRate(BigDecimal.valueOf(8000));
        sampleVehicle.setListingStatus("AVAILABLE");
    }

    @Test
    @DisplayName("Rental calculation: Exactly 24 hours equals 1 billable day")
    void testRentalDaysCalculation24Hours() {
        LocalDateTime start = LocalDateTime.of(2026, 11, 10, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 11, 11, 10, 0);

        int days = availabilityEngine.calculateRentalDays(start, end);
        assertEquals(1, days);
    }

    @Test
    @DisplayName("Rental calculation: 25 hours is billed as 2 days")
    void testRentalDaysCalculation25Hours() {
        LocalDateTime start = LocalDateTime.of(2026, 11, 10, 10, 0);
        LocalDateTime end = LocalDateTime.of(2026, 11, 11, 11, 0);

        int days = availabilityEngine.calculateRentalDays(start, end);
        assertEquals(2, days);
    }

    @Test
    @DisplayName("Availability check: Returns Available when no overlapping bookings exist")
    void testVehicleAvailableWhenNoConflicts() {
        LocalDateTime start = LocalDateTime.now().plusDays(2);
        LocalDateTime end = start.plusDays(3);

        when(vehicleRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(sampleVehicle));
        when(maintenanceRepository.findConflictingMaintenance(eq(1L), any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.findConflictingBookings(eq(1L), any(), any(), any())).thenReturn(Collections.emptyList());

        VehicleAvailabilityResponse response = availabilityEngine.checkAvailability(1L, start, end);

        assertTrue(response.isAvailable());
        assertEquals("Available", response.getStatus());
        assertEquals(3, response.getTotalDays());
        assertEquals(BigDecimal.valueOf(24000), response.getTotalAmount());
    }

    @Test
    @DisplayName("Availability check: Returns Booked when overlapping confirmed booking exists")
    void testVehicleUnavailableWhenConflictExists() {
        LocalDateTime start = LocalDateTime.now().plusDays(2);
        LocalDateTime end = start.plusDays(3);

        Booking conflict = new Booking();
        conflict.setBookingStatus("CONFIRMED");

        when(vehicleRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(sampleVehicle));
        when(maintenanceRepository.findConflictingMaintenance(eq(1L), any(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.findConflictingBookings(eq(1L), any(), any(), any())).thenReturn(List.of(conflict));

        VehicleAvailabilityResponse response = availabilityEngine.checkAvailability(1L, start, end);

        assertFalse(response.isAvailable());
        assertEquals("Booked", response.getStatus());
    }

    @Test
    @DisplayName("Availability check: Returns Maintenance when vehicle is under scheduled maintenance")
    void testVehicleUnavailableUnderMaintenance() {
        LocalDateTime start = LocalDateTime.now().plusDays(2);
        LocalDateTime end = start.plusDays(3);

        VehicleMaintenance maintenance = new VehicleMaintenance();
        maintenance.setStatus("SCHEDULED");

        when(vehicleRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(sampleVehicle));
        when(maintenanceRepository.findConflictingMaintenance(eq(1L), any(), any(), any())).thenReturn(List.of(maintenance));

        VehicleAvailabilityResponse response = availabilityEngine.checkAvailability(1L, start, end);

        assertFalse(response.isAvailable());
        assertEquals("Maintenance", response.getStatus());
    }

    @Test
    @DisplayName("Interval validation: Rejects end time before start time")
    void testInvalidIntervalRejection() {
        LocalDateTime start = LocalDateTime.now().plusDays(3);
        LocalDateTime end = LocalDateTime.now().plusDays(1);

        assertThrows(BadRequestException.class, () -> availabilityEngine.validateInterval(start, end));
    }
}

