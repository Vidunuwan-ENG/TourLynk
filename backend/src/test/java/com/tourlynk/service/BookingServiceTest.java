package com.tourlynk.service;

import com.tourlynk.dto.BookingCancelRequest;
import com.tourlynk.dto.BookingRequest;
import com.tourlynk.dto.BookingResponse;
import com.tourlynk.dto.VehicleAvailabilityResponse;
import com.tourlynk.entity.Booking;
import com.tourlynk.entity.User;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.exception.ConflictException;
import com.tourlynk.exception.ForbiddenException;
import com.tourlynk.repository.BookingRepository;
import com.tourlynk.repository.UserRepository;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AvailabilityEngine availabilityEngine;

    @InjectMocks
    private BookingService bookingService;

    private User sampleUser;
    private Vehicle sampleVehicle;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(10L);
        sampleUser.setEmail("test@tourlynk.lk");
        sampleUser.setFullName("Test Tourist");

        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setMake("Toyota");
        sampleVehicle.setModel("Axio");
        sampleVehicle.setDailyRate(BigDecimal.valueOf(8000));
        sampleVehicle.setListingStatus("AVAILABLE");
    }

    @Test
    @DisplayName("Create booking: Successfully creates and returns confirmed booking with snapshot rate")
    void testCreateBookingSuccess() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusDays(3);
        BookingRequest request = new BookingRequest(1L, start, end, "Scenic trip");

        VehicleAvailabilityResponse available = new VehicleAvailabilityResponse(1L, true, "Available", "Ok");

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sampleVehicle));
        when(availabilityEngine.checkAvailability(eq(1L), eq(start), eq(end))).thenReturn(available);
        when(availabilityEngine.calculateRentalDays(start, end)).thenReturn(3);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking b = invocation.getArgument(0);
            b.setId(100L);
            return b;
        });

        BookingResponse response = bookingService.createBooking(10L, request);

        assertNotNull(response);
        assertEquals("CONFIRMED", response.getBookingStatus());
        assertEquals(BigDecimal.valueOf(24000), response.getTotalAmount());
        assertEquals("Toyota", response.getVehicleMake());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Create booking: Throws ConflictException when vehicle is unavailable")
    void testCreateBookingThrowsConflictWhenUnavailable() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusDays(3);
        BookingRequest request = new BookingRequest(1L, start, end, "Trip");

        VehicleAvailabilityResponse unavailable = new VehicleAvailabilityResponse(1L, false, "Booked", "Already booked");

        when(userRepository.findById(10L)).thenReturn(Optional.of(sampleUser));
        when(vehicleRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sampleVehicle));
        when(availabilityEngine.checkAvailability(eq(1L), eq(start), eq(end))).thenReturn(unavailable);

        assertThrows(ConflictException.class, () -> bookingService.createBooking(10L, request));
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    @DisplayName("Cancel booking: Rejects cancellation if user does not own the booking")
    void testCancelBookingUnauthorizedUser() {
        Booking booking = new Booking();
        booking.setId(50L);
        booking.setUser(sampleUser); // user ID 10
        booking.setVehicle(sampleVehicle);
        booking.setBookingStatus("CONFIRMED");

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(booking));

        // Different user ID 999 trying to cancel
        assertThrows(ForbiddenException.class, () ->
                bookingService.cancelBooking(50L, 999L, "ROLE_USER", new BookingCancelRequest("Change of plans")));
    }
}

