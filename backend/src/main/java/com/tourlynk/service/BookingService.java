package com.tourlynk.service;

import com.tourlynk.dto.*;
import com.tourlynk.entity.Booking;
import com.tourlynk.entity.User;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ConflictException;
import com.tourlynk.exception.ForbiddenException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.BookingRepository;
import com.tourlynk.repository.UserRepository;
import com.tourlynk.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final AvailabilityEngine availabilityEngine;

    public BookingService(BookingRepository bookingRepository,
                          VehicleRepository vehicleRepository,
                          UserRepository userRepository,
                          AvailabilityEngine availabilityEngine) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.availabilityEngine = availabilityEngine;
    }

    /**
     * Creates a new booking with concurrency protection and server-side rate recalculation.
     */
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        availabilityEngine.validateInterval(request.getStartDateTime(), request.getEndDateTime());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Concurrency Lock: Lock the vehicle row during reservation creation
        Vehicle vehicle = vehicleRepository.findByIdForUpdate(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + request.getVehicleId()));

        // Authoritative availability check
        VehicleAvailabilityResponse availability = availabilityEngine.checkAvailability(
                vehicle.getId(), request.getStartDateTime(), request.getEndDateTime());

        if (!availability.isAvailable()) {
            throw new ConflictException("Vehicle is unavailable: " + availability.getMessage());
        }

        int totalDays = availabilityEngine.calculateRentalDays(request.getStartDateTime(), request.getEndDateTime());
        BigDecimal dailyRate = vehicle.getDailyRate();
        BigDecimal subtotal = dailyRate.multiply(BigDecimal.valueOf(totalDays));
        BigDecimal additionalFees = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(additionalFees);

        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDateTime(request.getStartDateTime());
        booking.setEndDateTime(request.getEndDateTime());
        booking.setTotalDays(totalDays);
        booking.setDailyRateSnapshot(dailyRate);
        booking.setSubtotal(subtotal);
        booking.setAdditionalFees(additionalFees);
        booking.setTotalAmount(totalAmount);
        booking.setCurrency("LKR");
        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentStatus("PAY_ON_PICKUP");
        booking.setSpecialNotes(request.getSpecialNotes());

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> getUserBookings(Long userId, Pageable pageable) {
        Page<Booking> page = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        List<BookingResponse> list = page.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return new PagedResponse<>(list, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookingsList(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id, Long currentUserId, String currentUserRole) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUserRole) || "ROLE_ADMIN".equalsIgnoreCase(currentUserRole);
        if (!isAdmin && !booking.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to view this booking.");
        }

        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, Long currentUserId, String currentUserRole, BookingCancelRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(currentUserRole) || "ROLE_ADMIN".equalsIgnoreCase(currentUserRole);
        if (!isAdmin && !booking.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("You are not authorized to cancel this booking.");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Booking is already cancelled.");
        }
        if ("COMPLETED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Completed bookings cannot be cancelled.");
        }

        booking.setBookingStatus("CANCELLED");
        String reason = request != null && request.getReason() != null ? request.getReason().trim() : "Cancelled by user";
        booking.setCancellationReason(reason);
        if ("PAID".equalsIgnoreCase(booking.getPaymentStatus())) {
            booking.setPaymentStatus("REFUNDED");
        }

        Booking updated = bookingRepository.save(booking);
        return toResponse(updated);
    }

    @Transactional(readOnly = true)
    public PagedResponse<BookingResponse> adminGetAllBookings(Pageable pageable) {
        Page<Booking> page = bookingRepository.findAll(pageable);
        List<BookingResponse> list = page.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return new PagedResponse<>(list, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }

    @Transactional
    public BookingResponse adminUpdateBookingStatus(Long id, BookingStatusUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        booking.setBookingStatus(request.getStatus().trim().toUpperCase());
        if (request.getNotes() != null) {
            booking.setSpecialNotes((booking.getSpecialNotes() != null ? booking.getSpecialNotes() + " | " : "") + request.getNotes());
        }

        Booking updated = bookingRepository.save(booking);
        return toResponse(updated);
    }

    public BookingResponse toResponse(Booking b) {
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setBookingReference(b.getBookingReference());
        res.setUserId(b.getUser().getId());
        res.setUserName(b.getUser().getFullName());
        res.setUserEmail(b.getUser().getEmail());

        res.setVehicleId(b.getVehicle().getId());
        res.setVehicleMake(b.getVehicle().getMake());
        res.setVehicleModel(b.getVehicle().getModel());
        res.setVehicleCategory(b.getVehicle().getCategory());
        res.setVehicleImageUrl(b.getVehicle().getPrimaryImageUrl());
        res.setVehicleRegistrationNumber(b.getVehicle().getRegistrationNumber());

        res.setStartDateTime(b.getStartDateTime());
        res.setEndDateTime(b.getEndDateTime());
        res.setTotalDays(b.getTotalDays());
        res.setDailyRateSnapshot(b.getDailyRateSnapshot());
        res.setSubtotal(b.getSubtotal());
        res.setAdditionalFees(b.getAdditionalFees());
        res.setTotalAmount(b.getTotalAmount());
        res.setCurrency(b.getCurrency());
        res.setBookingStatus(b.getBookingStatus());
        res.setPaymentStatus(b.getPaymentStatus());
        res.setSpecialNotes(b.getSpecialNotes());
        res.setCancellationReason(b.getCancellationReason());
        res.setCreatedAt(b.getCreatedAt());
        return res;
    }

    private String generateBookingReference() {
        String year = DateTimeFormatter.ofPattern("yyyy").format(LocalDateTime.now());
        String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return "TL-" + year + "-" + code;
    }
}

