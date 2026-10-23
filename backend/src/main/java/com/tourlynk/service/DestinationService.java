package com.tourlynk.service;

import com.tourlynk.dto.*;
import com.tourlynk.entity.Destination;
import com.tourlynk.entity.DestinationImage;
import com.tourlynk.entity.District;
import com.tourlynk.exception.BadRequestException;
import com.tourlynk.exception.ResourceNotFoundException;
import com.tourlynk.repository.DestinationRepository;
import com.tourlynk.repository.DistrictRepository;
import com.tourlynk.specification.DestinationSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;
    private final DistrictRepository districtRepository;

    public DestinationService(DestinationRepository destinationRepository,
                              DistrictRepository districtRepository) {
        this.destinationRepository = destinationRepository;
        this.districtRepository = districtRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<DestinationSummaryDto> getDestinations(
            String district,
            String category,
            String searchQuery,
            String sortBy,
            String sortDir,
            int page,
            int size) {

        Sort sort = Sort.by("asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC,
                mapSortProperty(sortBy));
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Destination> spec = DestinationSpecification.filterDestinations(
                district, category, searchQuery, true);

        Page<Destination> pageResult = destinationRepository.findAll(spec, pageable);

        List<DestinationSummaryDto> summaries = pageResult.getContent().stream()
                .map(this::toSummaryDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                summaries,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Transactional(readOnly = true)
    public List<DestinationSummaryDto> getPopularDestinations() {
        Pageable pageable = PageRequest.of(0, 4);
        List<Destination> popular = destinationRepository.findPopularDestinations(pageable);
        return popular.stream().map(this::toSummaryDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DestinationDto getDestinationBySlug(String slug) {
        Destination destination = destinationRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with slug: " + slug));
        return toDto(destination);
    }

    @Transactional(readOnly = true)
    public List<DistrictDto> getDistricts() {
        List<District> allDistricts = districtRepository.findAllByOrderByNameAsc();
        return allDistricts.stream()
                .map(d -> {
                    long count = destinationRepository.findByDistrictAndIsActiveTrue(d.getName()).size();
                    return new DistrictDto(d.getId(), d.getName(), d.getProvince(), count);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DestinationSummaryDto> getRelatedDestinations(String slug) {
        Destination destination = destinationRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found"));

        Pageable pageable = PageRequest.of(0, 3);
        List<Destination> related = destinationRepository.findRelatedDestinations(
                destination.getDistrict(), destination.getCategory(), destination.getId(), pageable);

        return related.stream().map(this::toSummaryDto).collect(Collectors.toList());
    }

    @Transactional
    public DestinationDto createDestination(DestinationCreateRequest request) {
        if (destinationRepository.existsBySlug(request.getSlug().trim())) {
            throw new BadRequestException("Destination slug already exists: " + request.getSlug());
        }

        Destination destination = new Destination();
        destination.setName(request.getName().trim());
        destination.setSlug(request.getSlug().trim().toLowerCase());
        destination.setDistrict(request.getDistrict().trim());
        destination.setProvince(request.getProvince().trim());
        destination.setShortDescription(request.getShortDescription().trim());
        destination.setFullDescription(request.getFullDescription().trim());
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());
        destination.setCategory(request.getCategory().trim());
        destination.setBestVisitPeriod(request.getBestVisitPeriod());
        destination.setEstimatedVisitDuration(request.getEstimatedVisitDuration());
        destination.setEntranceFeeInformation(request.getEntranceFeeInformation());
        destination.setPrimaryImageUrl(request.getPrimaryImageUrl().trim());
        destination.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getAdditionalImages() != null) {
            int order = 1;
            for (String url : request.getAdditionalImages()) {
                if (url != null && !url.isBlank()) {
                    destination.addImage(new DestinationImage(url.trim(), destination.getName(), order++));
                }
            }
        }

        Destination saved = destinationRepository.save(destination);
        return toDto(saved);
    }

    @Transactional
    public DestinationDto updateDestination(Long id, DestinationUpdateRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with ID: " + id));

        destination.setName(request.getName().trim());
        destination.setDistrict(request.getDistrict().trim());
        destination.setProvince(request.getProvince().trim());
        destination.setShortDescription(request.getShortDescription().trim());
        destination.setFullDescription(request.getFullDescription().trim());
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());
        destination.setCategory(request.getCategory().trim());
        destination.setBestVisitPeriod(request.getBestVisitPeriod());
        destination.setEstimatedVisitDuration(request.getEstimatedVisitDuration());
        destination.setEntranceFeeInformation(request.getEntranceFeeInformation());
        destination.setPrimaryImageUrl(request.getPrimaryImageUrl().trim());

        if (request.getIsActive() != null) {
            destination.setIsActive(request.getIsActive());
        }

        if (request.getAdditionalImages() != null) {
            destination.getImages().clear();
            int order = 1;
            for (String url : request.getAdditionalImages()) {
                if (url != null && !url.isBlank()) {
                    destination.addImage(new DestinationImage(url.trim(), destination.getName(), order++));
                }
            }
        }

        Destination updated = destinationRepository.save(destination);
        return toDto(updated);
    }

    public DestinationSummaryDto toSummaryDto(Destination d) {
        return new DestinationSummaryDto(
                d.getId(),
                d.getName(),
                d.getSlug(),
                d.getDistrict(),
                d.getShortDescription(),
                d.getLatitude(),
                d.getLongitude(),
                d.getCategory(),
                d.getPrimaryImageUrl(),
                d.getAverageRating(),
                d.getReviewCount()
        );
    }

    public DestinationDto toDto(Destination d) {
        DestinationDto dto = new DestinationDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setSlug(d.getSlug());
        dto.setDistrict(d.getDistrict());
        dto.setProvince(d.getProvince());
        dto.setShortDescription(d.getShortDescription());
        dto.setFullDescription(d.getFullDescription());
        dto.setLatitude(d.getLatitude());
        dto.setLongitude(d.getLongitude());
        dto.setCategory(d.getCategory());
        dto.setBestVisitPeriod(d.getBestVisitPeriod());
        dto.setEstimatedVisitDuration(d.getEstimatedVisitDuration());
        dto.setEntranceFeeInformation(d.getEntranceFeeInformation());
        dto.setPrimaryImageUrl(d.getPrimaryImageUrl());
        dto.setAverageRating(d.getAverageRating());
        dto.setReviewCount(d.getReviewCount());
        dto.setIsActive(d.getIsActive());
        dto.setCreatedAt(d.getCreatedAt());

        if (d.getImages() != null) {
            dto.setImages(d.getImages().stream()
                    .map(DestinationImage::getImageUrl)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private String mapSortProperty(String sortBy) {
        if ("rating".equalsIgnoreCase(sortBy)) return "averageRating";
        if ("name".equalsIgnoreCase(sortBy)) return "name";
        if ("reviews".equalsIgnoreCase(sortBy)) return "reviewCount";
        return "id";
    }
}

