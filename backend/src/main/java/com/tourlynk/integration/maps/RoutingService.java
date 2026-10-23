package com.tourlynk.integration.maps;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tourlynk.dto.DistanceRouteResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class RoutingService {

    private static final Logger log = LoggerFactory.getLogger(RoutingService.class);
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public RoutingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(3000);
        requestFactory.setReadTimeout(4000);

        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    /**
     * Calculates distance, driving duration, and route geometry between origin and destination.
     */
    public DistanceRouteResponse calculateRoute(BigDecimal originLat, BigDecimal originLng,
                                                BigDecimal destLat, BigDecimal destLng,
                                                String destinationName) {
        DistanceRouteResponse response = new DistanceRouteResponse();
        response.setOriginLatitude(originLat);
        response.setOriginLongitude(originLng);
        response.setDestinationLatitude(destLat);
        response.setDestinationLongitude(destLng);
        response.setDestinationName(destinationName);

        // 1. Calculate straight-line distance via Haversine
        double straightDistance = calculateHaversineDistanceKm(
                originLat.doubleValue(), originLng.doubleValue(),
                destLat.doubleValue(), destLng.doubleValue());
        response.setStraightLineDistanceKm(round(straightDistance, 1));

        // 2. Generate Google Maps navigation URL
        String navUrl = String.format("https://www.google.com/maps/dir/?api=1&origin=%f,%f&destination=%f,%f&travelmode=driving",
                originLat.doubleValue(), originLng.doubleValue(), destLat.doubleValue(), destLng.doubleValue());
        response.setNavigationUrl(navUrl);

        // 3. Attempt OSRM driving route lookup
        try {
            String osrmUrl = String.format(
                    "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=simplified&geometries=geojson",
                    originLng.doubleValue(), originLat.doubleValue(),
                    destLng.doubleValue(), destLat.doubleValue());

            String jsonResponse = restClient.get()
                    .uri(osrmUrl)
                    .retrieve()
                    .body(String.class);

            if (jsonResponse != null) {
                JsonNode root = objectMapper.readTree(jsonResponse);
                if ("Ok".equalsIgnoreCase(root.path("code").asText())) {
                    JsonNode route = root.path("routes").get(0);
                    double distanceMeters = route.path("distance").asDouble();
                    double durationSeconds = route.path("duration").asDouble();

                    double drivingKm = distanceMeters / 1000.0;
                    double drivingMins = durationSeconds / 60.0;

                    response.setDrivingDistanceKm(round(drivingKm, 1));
                    response.setDrivingDistanceText(formatDistance(drivingKm));
                    response.setDrivingDurationMinutes(round(drivingMins, 0));
                    response.setDrivingDurationText(formatDuration(drivingMins));
                    response.setRoutingSource("OSRM Driving Network");
                    response.setRouteFound(true);

                    // Extract coordinates [lat, lng]
                    JsonNode coordsNode = route.path("geometry").path("coordinates");
                    List<List<Double>> points = new ArrayList<>();
                    if (coordsNode.isArray()) {
                        for (JsonNode pt : coordsNode) {
                            double lng = pt.get(0).asDouble();
                            double lat = pt.get(1).asDouble();
                            List<Double> latLng = new ArrayList<>();
                            latLng.add(lat);
                            latLng.add(lng);
                            points.add(latLng);
                        }
                    }
                    response.setRouteCoordinates(points);
                    return response;
                }
            }
        } catch (Exception e) {
            log.warn("OSRM routing lookup unavailable: {}. Falling back to topographical estimate.", e.getMessage());
        }

        // 4. Graceful Fallback if OSRM is unreachable
        // In Sri Lanka's hilly terrain, driving road distance is typically ~1.35x straight line distance
        double estimatedRoadKm = straightDistance * 1.35;
        // Average driving speed in Sri Lanka ~45 km/h
        double estimatedMinutes = (estimatedRoadKm / 45.0) * 60.0;

        response.setDrivingDistanceKm(round(estimatedRoadKm, 1));
        response.setDrivingDistanceText(formatDistance(estimatedRoadKm) + " (est.)");
        response.setDrivingDurationMinutes(round(estimatedMinutes, 0));
        response.setDrivingDurationText(formatDuration(estimatedMinutes) + " (est.)");
        response.setRoutingSource("Topographical Estimate (Haversine)");
        response.setRouteFound(false);

        List<List<Double>> directPoints = new ArrayList<>();
        directPoints.add(List.of(originLat.doubleValue(), originLng.doubleValue()));
        directPoints.add(List.of(destLat.doubleValue(), destLng.doubleValue()));
        response.setRouteCoordinates(directPoints);

        return response;
    }

    public double calculateHaversineDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    private double round(double val, int places) {
        return BigDecimal.valueOf(val).setScale(places, RoundingMode.HALF_UP).doubleValue();
    }

    private String formatDistance(double km) {
        if (km < 1.0) {
            return String.format("%d m", (int) (km * 1000));
        }
        return String.format("%.1f km", km);
    }

    private String formatDuration(double totalMinutes) {
        int hours = (int) (totalMinutes / 60);
        int mins = (int) (totalMinutes % 60);
        if (hours == 0) {
            return String.format("%d mins", Math.max(1, mins));
        }
        return String.format("%d hr %d mins", hours, mins);
    }
}

