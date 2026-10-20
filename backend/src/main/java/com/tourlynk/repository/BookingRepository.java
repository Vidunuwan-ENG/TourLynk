package com.tourlynk.repository;

import com.tourlynk.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    Page<Booking> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.bookingStatus IN :blockingStatuses " +
           "AND b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime")
    List<Booking> findConflictingBookings(
            @Param("vehicleId") Long vehicleId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("blockingStatuses") Collection<String> blockingStatuses);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.id <> :excludeBookingId " +
           "AND b.bookingStatus IN :blockingStatuses " +
           "AND b.startDateTime < :endDateTime AND b.endDateTime > :startDateTime")
    List<Booking> findConflictingBookingsExcluding(
            @Param("vehicleId") Long vehicleId,
            @Param("excludeBookingId") Long excludeBookingId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("blockingStatuses") Collection<String> blockingStatuses);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
           "AND b.bookingStatus IN ('CONFIRMED', 'PENDING') " +
           "AND b.endDateTime >= :now")
    List<Booking> findActiveAndFutureBookingsForVehicle(
            @Param("vehicleId") Long vehicleId,
            @Param("now") LocalDateTime now);

    long countByBookingStatus(String bookingStatus);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED' AND b.startDateTime > :now")
    long countUpcomingBookings(@Param("now") LocalDateTime now);

    List<Booking> findTop5ByOrderByCreatedAtDesc();
}

