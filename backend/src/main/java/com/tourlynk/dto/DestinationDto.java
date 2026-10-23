package com.tourlynk.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DestinationDto {
    private Long id;
    private String name;
    private String slug;
    private String district;
    private String province;
    private String shortDescription;
    private String fullDescription;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String category;
    private String bestVisitPeriod;
    private String estimatedVisitDuration;
    private String entranceFeeInformation;
    private String primaryImageUrl;
    private BigDecimal averageRating;
    private Integer reviewCount;
    private Boolean isActive;
    private List<String> images = new ArrayList<>();
    private LocalDateTime createdAt;

    public DestinationDto() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBestVisitPeriod() { return bestVisitPeriod; }
    public void setBestVisitPeriod(String bestVisitPeriod) { this.bestVisitPeriod = bestVisitPeriod; }

    public String getEstimatedVisitDuration() { return estimatedVisitDuration; }
    public void setEstimatedVisitDuration(String estimatedVisitDuration) { this.estimatedVisitDuration = estimatedVisitDuration; }

    public String getEntranceFeeInformation() { return entranceFeeInformation; }
    public void setEntranceFeeInformation(String entranceFeeInformation) { this.entranceFeeInformation = entranceFeeInformation; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

