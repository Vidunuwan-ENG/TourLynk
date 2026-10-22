package com.tourlynk.service;

import com.tourlynk.dto.*;
import com.tourlynk.entity.Vehicle;
import com.tourlynk.entity.VehicleImage;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.FavoriteRepository;
import com.tourlynk.repository.VehicleRepository;
import com.tourlynk.specification.VehicleSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final FavoriteRepository favoriteRepository;
    private final AvailabilityEngine availabilityEngine;

    public VehicleService(VehicleRepository vehicleRepository,
                          FavoriteRepository favoriteRepository,
                          AvailabilityEngine availabilityEngine) {
        this.vehicleRepository = vehicleRepository;
        this.favoriteRepository = favoriteRepository;
        this.availabilityEngine = availabilityEngine;
    }

    @Transactional(readOnly = true)
    public PagedResponse<VehicleDto> getVehicles(
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minPassengers,
            String transmission,
            String fuelType,
            String searchQuery,
            LocalDateTime startDateTime,
            LocalDateTime endDateTime,
            String sortBy,
            String sortDir,
            int page,
            int size,
            Long currentUserId) {

        Sort sort = Sort.by("asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC,
                mapSortProperty(sortBy));
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Vehicle> spec = VehicleSpecification.filterVehicles(
                category, minPrice, maxPrice, minPassengers, transmission, fuelType, searchQuery, null);

        Page<Vehicle> vehiclePage = vehicleRepository.findAll(spec, pageable);

        List<VehicleDto> dtoList = vehiclePage.getContent().stream()
                .map(v -> toDto(v, currentUserId, startDateTime, endDateTime))
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtoList,
                vehiclePage.getNumber(),
                vehiclePage.getSize(),
                vehiclePage.getTotalElements(),
                vehiclePage.getTotalPages(),
                vehiclePage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getPopularVehicles(Long currentUserId) {
        Pageable pageable = PageRequest.of(0, 4);
        List<Vehicle> popular = vehicleRepository.findPopularVehicles(pageable);
        return popular.stream()
                .map(v -> toDto(v, currentUserId, null, null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VehicleDto getVehicleById(Long id, Long currentUserId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
        return toDto(vehicle, currentUserId, startDateTime, endDateTime);
    }

    @Transactional
    public VehicleDto createVehicle(VehicleCreateRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber().trim())) {
            throw new BadRequestException("Registration number already exists: " + request.getRegistrationNumber());
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setMake(request.getMake().trim());
        vehicle.setModel(request.getModel().trim());
        vehicle.setManufacturingYear(request.getManufacturingYear());
        vehicle.setCategory(request.getCategory().trim());
        vehicle.setDescription(request.getDescription().trim());
        vehicle.setRegistrationNumber(request.getRegistrationNumber().trim().toUpperCase());
        vehicle.setPassengerCapacity(request.getPassengerCapacity());
        vehicle.setLuggageCapacity(request.getLuggageCapacity());
        vehicle.setTransmission(request.getTransmission().trim());
        vehicle.setFuelType(request.getFuelType().trim());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setListingStatus(request.getListingStatus() != null ? request.getListingStatus() : "AVAILABLE");
        vehicle.setPrimaryImageUrl(request.getPrimaryImageUrl().trim());

        if (request.getAdditionalImages() != null) {
            int order = 1;
            for (String imgUrl : request.getAdditionalImages()) {
                if (imgUrl != null && !imgUrl.isBlank()) {
                    vehicle.addImage(new VehicleImage(imgUrl.trim(), vehicle.getMake() + " " + vehicle.getModel(), order++));
                }
            }
        }

        Vehicle saved = vehicleRepository.save(vehicle);
        return toDto(saved, null, null, null);
    }

    @Transactional
    public VehicleDto updateVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));

        vehicle.setMake(request.getMake().trim());
        vehicle.setModel(request.getModel().trim());
        vehicle.setManufacturingYear(request.getManufacturingYear());
        vehicle.setCategory(request.getCategory().trim());
        vehicle.setDescription(request.getDescription().trim());
        vehicle.setRegistrationNumber(request.getRegistrationNumber().trim().toUpperCase());
        vehicle.setPassengerCapacity(request.getPassengerCapacity());
        vehicle.setLuggageCapacity(request.getLuggageCapacity());
        vehicle.setTransmission(request.getTransmission().trim());
        vehicle.setFuelType(request.getFuelType().trim());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setListingStatus(request.getListingStatus().trim());
        vehicle.setPrimaryImageUrl(request.getPrimaryImageUrl().trim());

        if (request.getAdditionalImages() != null) {
            vehicle.getImages().clear();
            int order = 1;
            for (String imgUrl : request.getAdditionalImages()) {
                if (imgUrl != null && !imgUrl.isBlank()) {
                    vehicle.addImage(new VehicleImage(imgUrl.trim(), vehicle.getMake() + " " + vehicle.getModel(), order++));
                }
            }
        }

        Vehicle updated = vehicleRepository.save(vehicle);
        return toDto(updated, null, null, null);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
        vehicle.setDeletedAt(LocalDateTime.now());
        vehicle.setListingStatus("ARCHIVED");
        vehicleRepository.save(vehicle);
    }

    public VehicleDto toDto(Vehicle vehicle, Long currentUserId, LocalDateTime start, LocalDateTime end) {
        VehicleDto dto = new VehicleDto();
        dto.setId(vehicle.getId());
        dto.setMake(vehicle.getMake());
        dto.setModel(vehicle.getModel());
        dto.setManufacturingYear(vehicle.getManufacturingYear());
        dto.setCategory(vehicle.getCategory());
        dto.setDescription(vehicle.getDescription());
        dto.setRegistrationNumber(vehicle.getRegistrationNumber());
        dto.setPassengerCapacity(vehicle.getPassengerCapacity());
        dto.setLuggageCapacity(vehicle.getLuggageCapacity());
        dto.setTransmission(vehicle.getTransmission());
        dto.setFuelType(vehicle.getFuelType());
        dto.setDailyRate(vehicle.getDailyRate());
        dto.setListingStatus(vehicle.getListingStatus());
        dto.setPrimaryImageUrl(vehicle.getPrimaryImageUrl());
        dto.setCreatedAt(vehicle.getCreatedAt());

        if (vehicle.getImages() != null) {
            dto.setImages(vehicle.getImages().stream()
                    .map(img -> new VehicleImageDto(img.getId(), img.getImageUrl(), img.getAltText(), img.getDisplayOrder()))
                    .collect(Collectors.toList()));
        }

        // Check if user favorited
        if (currentUserId != null) {
            dto.setFavorite(favoriteRepository.existsByUserIdAndVehicleId(currentUserId, vehicle.getId()));
        }

        // Compute availability
        if (start != null && end != null && end.isAfter(start)) {
            VehicleAvailabilityResponse check = availabilityEngine.checkAvailability(vehicle.getId(), start, end);
            dto.setAvailable(check.isAvailable());
            dto.setComputedStatus(check.getStatus());
        } else {
            // General listing status without specific dates
            if ("AVAILABLE".equalsIgnoreCase(vehicle.getListingStatus())) {
                dto.setAvailable(true);
                dto.setComputedStatus("Available");
            } else if ("MAINTENANCE".equalsIgnoreCase(vehicle.getListingStatus())) {
                dto.setAvailable(false);
                dto.setComputedStatus("Maintenance");
            } else {
                dto.setAvailable(false);
                dto.setComputedStatus("Unavailable");
            }
        }

        return dto;
    }

    private String mapSortProperty(String sortBy) {
        if ("price".equalsIgnoreCase(sortBy)) return "dailyRate";
        if ("year".equalsIgnoreCase(sortBy)) return "manufacturingYear";
        if ("make".equalsIgnoreCase(sortBy)) return "make";
        if ("category".equalsIgnoreCase(sortBy)) return "category";
        return "id";
    }
}

