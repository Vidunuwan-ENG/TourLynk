package com.tourlynk.controller;

import com.tourlynk.dto.*;
import com.tourlynk.integration.maps.RoutingService;
import com.tourlynk.security.UserPrincipal;
import com.tourlynk.service.DestinationService;
import com.tourlynk.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/destinations")
public class DestinationController {

    private final DestinationService destinationService;
    private final ReviewService reviewService;
    private final RoutingService routingService;

    public DestinationController(DestinationService destinationService,
                                 ReviewService reviewService,
                                 RoutingService routingService) {
        this.destinationService = destinationService;
        this.reviewService = reviewService;
        this.routingService = routingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<DestinationSummaryDto>>> getDestinations(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PagedResponse<DestinationSummaryDto> response = destinationService.getDestinations(
                district, category, search, sortBy, sortDir, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<DistrictDto>>> getDistricts() {
        List<DistrictDto> districts = destinationService.getDistricts();
        return ResponseEntity.ok(ApiResponse.ok(districts));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<List<DestinationSummaryDto>>> getPopularDestinations() {
        List<DestinationSummaryDto> popular = destinationService.getPopularDestinations();
        return ResponseEntity.ok(ApiResponse.ok(popular));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<DestinationDto>> getDestinationBySlug(@PathVariable String slug) {
        DestinationDto dto = destinationService.getDestinationBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/{slug}/related")
    public ResponseEntity<ApiResponse<List<DestinationSummaryDto>>> getRelatedDestinations(@PathVariable String slug) {
        List<DestinationSummaryDto> related = destinationService.getRelatedDestinations(slug);
        return ResponseEntity.ok(ApiResponse.ok(related));
    }

    @GetMapping("/{slug}/directions")
    public ResponseEntity<ApiResponse<DistanceRouteResponse>> getDirections(
            @PathVariable String slug,
            @RequestParam BigDecimal userLat,
            @RequestParam BigDecimal userLng) {
        DestinationDto dest = destinationService.getDestinationBySlug(slug);
        DistanceRouteResponse directions = routingService.calculateRoute(
                userLat, userLng, dest.getLatitude(), dest.getLongitude(), dest.getName());
        return ResponseEntity.ok(ApiResponse.ok(directions));
    }

    @GetMapping("/{slug}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getReviews(@PathVariable String slug) {
        List<ReviewDto> reviews = reviewService.getDestinationReviews(slug);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping("/{slug}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ReviewCreateRequest request) {
        ReviewDto review = reviewService.createDestinationReview(userPrincipal.getId(), slug, request);
        return new ResponseEntity<>(ApiResponse.ok("Review submitted successfully", review), HttpStatus.CREATED);
    }
}

