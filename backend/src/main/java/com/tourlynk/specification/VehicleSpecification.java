package com.tourlynk.specification;

import com.tourlynk.entity.Vehicle;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> filterVehicles(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minPassengers,
            String transmission,
            String fuelType,
            String searchQuery,
            String listingStatus) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Soft-deleted vehicles are always excluded
            predicates.add(cb.isNull(root.get("deletedAt")));

            if (StringUtils.hasText(category) && !"ALL".equalsIgnoreCase(category)) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase().trim()));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dailyRate"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dailyRate"), maxPrice));
            }

            if (minPassengers != null && minPassengers > 0) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("passengerCapacity"), minPassengers));
            }

            if (StringUtils.hasText(transmission) && !"ALL".equalsIgnoreCase(transmission)) {
                predicates.add(cb.equal(cb.lower(root.get("transmission")), transmission.toLowerCase().trim()));
            }

            if (StringUtils.hasText(fuelType) && !"ALL".equalsIgnoreCase(fuelType)) {
                predicates.add(cb.equal(cb.lower(root.get("fuelType")), fuelType.toLowerCase().trim()));
            }

            if (StringUtils.hasText(listingStatus)) {
                predicates.add(cb.equal(root.get("listingStatus"), listingStatus));
            }

            if (StringUtils.hasText(searchQuery)) {
                String term = "%" + searchQuery.toLowerCase().trim() + "%";
                Predicate makeMatch = cb.like(cb.lower(root.get("make")), term);
                Predicate modelMatch = cb.like(cb.lower(root.get("model")), term);
                predicates.add(cb.or(makeMatch, modelMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

