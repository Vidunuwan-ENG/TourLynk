package com.tourlynk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class DestinationUpdateRequest {

    @NotBlank(message = "Destination name is required")
    private String name;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Province is required")
    private String province;

    @NotBlank(message = "Short description is required")
    private String shortDescription;

    @NotBlank(message = "Full description is required")
    private String fullDescription;

    @NotNull(message = "Latitude is required")
    private BigDecimal latitude;

    @NotNull(message = "Longitude is required")
    private BigDecimal longitude;

    @NotBlank(message = "Category is required")
    private String category;

    private String bestVisitPeriod;
    private String estimatedVisitDuration;
    private String entranceFeeInformation;

    @NotBlank(message = "Primary image URL is required")
    private String primaryImageUrl;

    private Boolean isActive;

    private List<String> additionalImages;

    public DestinationUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<String> getAdditionalImages() { return additionalImages; }
    public void setAdditionalImages(List<String> additionalImages) { this.additionalImages = additionalImages; }
}

