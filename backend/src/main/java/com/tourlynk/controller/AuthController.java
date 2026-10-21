package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.AuthResponse;
import com.tourlynk.dto.LoginRequest;
import com.tourlynk.dto.RegisterRequest;
import com.tourlynk.dto.UserDto;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.AuthService;
import com.tourlynk.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.ok("Registration successful", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", "Session terminated"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return new ResponseEntity<>(ApiResponse.error("Unauthenticated"), HttpStatus.UNAUTHORIZED);
        }
        UserDto userDto = userService.getCurrentUserDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(userDto));
    }
}

