package com.tourlynk.repository;

import com.tourlynk.entity.Vehicle;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {

    Optional<Vehicle> findByIdAndDeletedAtIsNull(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicle v WHERE v.id = :id AND v.deletedAt IS NULL")
    Optional<Vehicle> findByIdForUpdate(@Param("id") Long id);

    Page<Vehicle> findByDeletedAtIsNull(Pageable pageable);

    @Query("SELECT v FROM Vehicle v WHERE v.deletedAt IS NULL AND v.listingStatus = 'AVAILABLE' ORDER BY v.dailyRate ASC")
    List<Vehicle> findPopularVehicles(Pageable pageable);

    long countByDeletedAtIsNull();

    long countByListingStatusAndDeletedAtIsNull(String listingStatus);

    boolean existsByRegistrationNumber(String registrationNumber);
}

