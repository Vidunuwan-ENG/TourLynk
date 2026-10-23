package com.tourlynk.dto;

public class DistrictDto {
    private Long id;
    private String name;
    private String province;
    private long destinationCount;

    public DistrictDto() {}

    public DistrictDto(Long id, String name, String province, long destinationCount) {
        this.id = id;
        this.name = name;
        this.province = province;
        this.destinationCount = destinationCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public long getDestinationCount() { return destinationCount; }
    public void setDestinationCount(long destinationCount) { this.destinationCount = destinationCount; }
}

