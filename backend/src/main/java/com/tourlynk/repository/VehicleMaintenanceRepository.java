package com.tourlynk.repository;

import com.tourlynk.entity.VehicleMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface VehicleMaintenanceRepository extends JpaRepository<VehicleMaintenance, Long> {

    List<VehicleMaintenance> findByVehicleIdOrderByStartDateTimeDesc(Long vehicleId);

    @Query("SELECT m FROM VehicleMaintenance m WHERE m.vehicle.id = :vehicleId " +
           "AND m.status IN :blockingStatuses " +
           "AND m.startDateTime < :endDateTime AND m.endDateTime > :startDateTime")
    List<VehicleMaintenance> findConflictingMaintenance(
            @Param("vehicleId") Long vehicleId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime,
            @Param("blockingStatuses") Collection<String> blockingStatuses);

    long countByStatus(String status);
}

