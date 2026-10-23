package com.tourlynk.dto;

import java.math.BigDecimal;
import java.util.List;

public class DistanceRouteResponse {
    private BigDecimal originLatitude;
    private BigDecimal originLongitude;
    private BigDecimal destinationLatitude;
    private BigDecimal destinationLongitude;
    private String destinationName;
    private double straightLineDistanceKm;
    private Double drivingDistanceKm;
    private String drivingDistanceText;
    private Double drivingDurationMinutes;
    private String drivingDurationText;
    private String navigationUrl; // External Google Maps direct link with accurate coordinates
    private String routingSource; // "OSRM", "Haversine"
    private boolean routeFound;
    private List<List<Double>> routeCoordinates; // [lat, lng] points for drawing polyline

    public DistanceRouteResponse() {}

    public BigDecimal getOriginLatitude() { return originLatitude; }
    public void setOriginLatitude(BigDecimal originLatitude) { this.originLatitude = originLatitude; }

    public BigDecimal getOriginLongitude() { return originLongitude; }
    public void setOriginLongitude(BigDecimal originLongitude) { this.originLongitude = originLongitude; }

    public BigDecimal getDestinationLatitude() { return destinationLatitude; }
    public void setDestinationLatitude(BigDecimal destinationLatitude) { this.destinationLatitude = destinationLatitude; }

    public BigDecimal getDestinationLongitude() { return destinationLongitude; }
    public void setDestinationLongitude(BigDecimal destinationLongitude) { this.destinationLongitude = destinationLongitude; }

    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) { this.destinationName = destinationName; }

    public double getStraightLineDistanceKm() { return straightLineDistanceKm; }
    public void setStraightLineDistanceKm(double straightLineDistanceKm) { this.straightLineDistanceKm = straightLineDistanceKm; }

    public Double getDrivingDistanceKm() { return drivingDistanceKm; }
    public void setDrivingDistanceKm(Double drivingDistanceKm) { this.drivingDistanceKm = drivingDistanceKm; }

    public String getDrivingDistanceText() { return drivingDistanceText; }
    public void setDrivingDistanceText(String drivingDistanceText) { this.drivingDistanceText = drivingDistanceText; }

    public Double getDrivingDurationMinutes() { return drivingDurationMinutes; }
    public void setDrivingDurationMinutes(Double drivingDurationMinutes) { this.drivingDurationMinutes = drivingDurationMinutes; }

    public String getDrivingDurationText() { return drivingDurationText; }
    public void setDrivingDurationText(String drivingDurationText) { this.drivingDurationText = drivingDurationText; }

    public String getNavigationUrl() { return navigationUrl; }
    public void setNavigationUrl(String navigationUrl) { this.navigationUrl = navigationUrl; }

    public String getRoutingSource() { return routingSource; }
    public void setRoutingSource(String routingSource) { this.routingSource = routingSource; }

    public boolean isRouteFound() { return routeFound; }
    public void setRouteFound(boolean routeFound) { this.routeFound = routeFound; }

    public List<List<Double>> getRouteCoordinates() { return routeCoordinates; }
    public void setRouteCoordinates(List<List<Double>> routeCoordinates) { this.routeCoordinates = routeCoordinates; }
}

