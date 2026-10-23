package com.tourlynk.service;

import com.tourlynk.dto.ReviewCreateRequest;
import com.tourlynk.dto.ReviewDto;
import com.tourlynk.entity.Destination;
import com.tourlynk.entity.Review;
import com.tourlynk.entity.User;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.DestinationRepository;
import com.tourlynk.repository.ReviewRepository;
import com.tourlynk.repository.UserRepository;
import com.tourlynk.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         DestinationRepository destinationRepository,
                         VehicleRepository vehicleRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.destinationRepository = destinationRepository;
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getDestinationReviews(String slug) {
        Destination destination = destinationRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));
        List<Review> reviews = reviewRepository.findByDestinationIdOrderByCreatedAtDesc(destination.getId());
        return reviews.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getVehicleReviews(Long vehicleId) {
        List<Review> reviews = reviewRepository.findByVehicleIdOrderByCreatedAtDesc(vehicleId);
        return reviews.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto createDestinationReview(Long userId, String slug, ReviewCreateRequest request) {
        Destination destination = destinationRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (reviewRepository.existsByUserIdAndDestinationId(userId, destination.getId())) {
            throw new BadRequestException("You have already reviewed this destination.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setDestination(destination);
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText().trim());

        Review saved = reviewRepository.save(review);

        // Update destination aggregate rating
        Double avg = reviewRepository.calculateAverageRatingForDestination(destination.getId());
        long count = reviewRepository.countByDestinationId(destination.getId());
        if (avg != null) {
            destination.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            destination.setReviewCount((int) count);
            destinationRepository.save(destination);
        }

        return toDto(saved);
    }

    public ReviewDto toDto(Review r) {
        ReviewDto dto = new ReviewDto();
        dto.setId(r.getId());
        dto.setUserId(r.getUser().getId());
        dto.setUserName(r.getUser().getFullName());
        if (r.getDestination() != null) {
            dto.setDestinationId(r.getDestination().getId());
            dto.setDestinationName(r.getDestination().getName());
        }
        if (r.getVehicle() != null) {
            dto.setVehicleId(r.getVehicle().getId());
            dto.setVehicleModel(r.getVehicle().getMake() + " " + r.getVehicle().getModel());
        }
        dto.setRating(r.getRating());
        dto.setReviewText(r.getReviewText());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}

