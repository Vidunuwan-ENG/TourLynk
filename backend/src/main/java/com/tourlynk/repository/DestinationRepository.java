package com.tourlynk.repository;

import com.tourlynk.entity.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long>, JpaSpecificationExecutor<Destination> {

    Optional<Destination> findBySlugAndIsActiveTrue(String slug);

    Optional<Destination> findBySlug(String slug);

    Page<Destination> findByIsActiveTrue(Pageable pageable);

    List<Destination> findByDistrictAndIsActiveTrue(String district);

    @Query("SELECT d FROM Destination d WHERE d.isActive = true ORDER BY d.averageRating DESC, d.reviewCount DESC")
    List<Destination> findPopularDestinations(Pageable pageable);

    @Query("SELECT d FROM Destination d WHERE d.isActive = true AND d.id <> :excludeId " +
           "AND (d.district = :district OR d.category = :category) ORDER BY d.averageRating DESC")
    List<Destination> findRelatedDestinations(
            @Param("district") String district,
            @Param("category") String category,
            @Param("excludeId") Long excludeId,
            Pageable pageable);

    long countByIsActiveTrue();

    boolean existsBySlug(String slug);
}

