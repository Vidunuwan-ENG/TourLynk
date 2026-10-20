package com.tourlynk.specification;

import com.tourlynk.entity.Destination;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class DestinationSpecification {

    public static Specification<Destination> filterDestinations(
            String district,
            String category,
            String searchQuery,
            Boolean isActiveOnly) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (isActiveOnly != null && isActiveOnly) {
                predicates.add(cb.isTrue(root.get("isActive")));
            }

            if (StringUtils.hasText(district) && !"All Districts".equalsIgnoreCase(district.trim()) && !"ALL".equalsIgnoreCase(district.trim())) {
                predicates.add(cb.equal(cb.lower(root.get("district")), district.toLowerCase().trim()));
            }

            if (StringUtils.hasText(category) && !"ALL".equalsIgnoreCase(category.trim())) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase().trim()));
            }

            if (StringUtils.hasText(searchQuery)) {
                String term = "%" + searchQuery.toLowerCase().trim() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), term);
                Predicate descMatch = cb.like(cb.lower(root.get("shortDescription")), term);
                predicates.add(cb.or(nameMatch, descMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

