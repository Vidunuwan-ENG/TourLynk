package com.tourlynk.service;

import com.tourlynk.dto.MaintenanceCreateRequest;
import com.tourlynk.dto.VehicleMaintenanceDto;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.entity.VehicleMaintenance;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.VehicleMaintenanceRepository;
import com.tourlynk.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    private final VehicleMaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(VehicleMaintenanceRepository maintenanceRepository,
                              VehicleRepository vehicleRepository) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleMaintenanceDto> getMaintenanceForVehicle(Long vehicleId) {
        List<VehicleMaintenance> list = maintenanceRepository.findByVehicleIdOrderByStartDateTimeDesc(vehicleId);
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<VehicleMaintenanceDto> getAllMaintenance() {
        return maintenanceRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public VehicleMaintenanceDto createMaintenance(MaintenanceCreateRequest request) {
        if (!request.getEndDateTime().isAfter(request.getStartDateTime())) {
            throw new BadRequestException("Maintenance end date must be after start date.");
        }

        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        VehicleMaintenance maintenance = new VehicleMaintenance();
        maintenance.setVehicle(vehicle);
        maintenance.setStartDateTime(request.getStartDateTime());
        maintenance.setEndDateTime(request.getEndDateTime());
        maintenance.setReason(request.getReason().trim());
        maintenance.setStatus(request.getStatus() != null ? request.getStatus().trim().toUpperCase() : "SCHEDULED");

        VehicleMaintenance saved = maintenanceRepository.save(maintenance);
        return toDto(saved);
    }

    @Transactional
    public void deleteMaintenance(Long id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Maintenance record not found with ID: " + id);
        }
        maintenanceRepository.deleteById(id);
    }

    public VehicleMaintenanceDto toDto(VehicleMaintenance m) {
        VehicleMaintenanceDto dto = new VehicleMaintenanceDto();
        dto.setId(m.getId());
        dto.setVehicleId(m.getVehicle().getId());
        dto.setVehicleModel(m.getVehicle().getMake() + " " + m.getVehicle().getModel());
        dto.setVehicleRegistrationNumber(m.getVehicle().getRegistrationNumber());
        dto.setStartDateTime(m.getStartDateTime());
        dto.setEndDateTime(m.getEndDateTime());
        dto.setReason(m.getReason());
        dto.setStatus(m.getStatus());
        dto.setCreatedAt(m.getCreatedAt());
        return dto;
    }
}

