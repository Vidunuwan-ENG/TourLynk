package com.tourlynk.dto;

import java.math.BigDecimal;

public class DestinationSummaryDto {
    private Long id;
    private String name;
    private String slug;
    private String district;
    private String shortDescription;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String category;
    private String primaryImageUrl;
    private BigDecimal averageRating;
    private Integer reviewCount;

    public DestinationSummaryDto() {}

    public DestinationSummaryDto(Long id, String name, String slug, String district, String shortDescription,
                                 BigDecimal latitude, BigDecimal longitude, String category,
                                 String primaryImageUrl, BigDecimal averageRating, Integer reviewCount) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.district = district;
        this.shortDescription = shortDescription;
        this.latitude = latitude;
        this.longitude = longitude;
        this.category = category;
        this.primaryImageUrl = primaryImageUrl;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
}

