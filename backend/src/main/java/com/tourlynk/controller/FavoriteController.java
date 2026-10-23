package com.tourlynk.controller;

import com.tourlynk.dto.ApiResponse;
import com.tourlynk.dto.FavoriteDto;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteDto>>> getFavorites(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<FavoriteDto> favorites = favoriteService.getUserFavorites(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(favorites));
    }

    @PostMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<String>> addFavorite(
            @PathVariable Long vehicleId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        favoriteService.addFavorite(userPrincipal.getId(), vehicleId);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle added to favorites", "Saved"));
    }

    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<String>> removeFavorite(
            @PathVariable Long vehicleId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        favoriteService.removeFavorite(userPrincipal.getId(), vehicleId);
        return ResponseEntity.ok(ApiResponse.ok("Vehicle removed from favorites", "Removed"));
    }
}

