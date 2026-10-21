package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.BookingResponse;
import com.tourlynk.dto.UserDto;
import com.tourlynk.dto.UserProfileUpdateRequest;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.BookingService;
import com.tourlynk.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final BookingService bookingService;

    public UserController(UserService userService, BookingService bookingService) {
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserDto user = userService.getCurrentUserDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        UserDto updated = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/me/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponse> bookings = bookingService.getUserBookingsList(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }
}

