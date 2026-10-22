package com.tourlynk.dto;

public class VehicleImageDto {
    private Long id;
    private String imageUrl;
    private String altText;
    private Integer displayOrder;

    public VehicleImageDto() {}

    public VehicleImageDto(Long id, String imageUrl, String altText, Integer displayOrder) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}

