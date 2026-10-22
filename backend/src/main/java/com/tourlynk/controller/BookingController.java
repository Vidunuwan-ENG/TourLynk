package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.BookingCancelRequest;
import com.tourlynk.dto.BookingRequest;
import com.tourlynk.dto.BookingResponse;
import com.tourlynk.dto.PagedResponse;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.ok("Booking confirmed successfully", booking), HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponse<BookingResponse> response = bookingService.getUserBookings(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String role = userPrincipal.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER");
        BookingResponse booking = bookingService.getBookingById(id, userPrincipal.getId(), role);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody(required = false) BookingCancelRequest request) {
        String role = userPrincipal.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER");
        BookingResponse cancelled = bookingService.cancelBooking(id, userPrincipal.getId(), role, request);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", cancelled));
    }
}

