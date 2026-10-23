package com.tourlynk.service;

import com.tourlynk.dto.BookingResponse;
import com.tourlynk.dto.DashboardSummaryDto;
import com.tourlynk.entity.Booking;
import com.tourlynk.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;
    private final VehicleMaintenanceRepository maintenanceRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final BookingService bookingService;

    public AdminDashboardService(VehicleRepository vehicleRepository,
                                 BookingRepository bookingRepository,
                                 UserRepository userRepository,
                                 DestinationRepository destinationRepository,
                                 VehicleMaintenanceRepository maintenanceRepository,
                                 ContactMessageRepository contactMessageRepository,
                                 BookingService bookingService) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.bookingService = bookingService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto summary = new DashboardSummaryDto();

        long totalVehicles = vehicleRepository.countByDeletedAtIsNull();
        long availableVehicles = vehicleRepository.countByListingStatusAndDeletedAtIsNull("AVAILABLE");
        long unavailableVehicles = totalVehicles - availableVehicles;

        long upcomingBookings = bookingRepository.countUpcomingBookings(LocalDateTime.now());
        long confirmedBookings = bookingRepository.countByBookingStatus("CONFIRMED");
        long cancelledBookings = bookingRepository.countByBookingStatus("CANCELLED");
        long completedBookings = bookingRepository.countByBookingStatus("COMPLETED");

        long totalUsers = userRepository.count();
        long totalDestinations = destinationRepository.countByIsActiveTrue();
        long activeMaintenance = maintenanceRepository.countByStatus("SCHEDULED") +
                                 maintenanceRepository.countByStatus("IN_PROGRESS");
        long unreadMessages = contactMessageRepository.countByStatus("NEW");

        List<Booking> recent = bookingRepository.findTop5ByOrderByCreatedAtDesc();
        List<BookingResponse> recentDtos = recent.stream()
                .map(bookingService::toResponse)
                .collect(Collectors.toList());

        summary.setTotalVehicles(totalVehicles);
        summary.setAvailableVehicles(availableVehicles);
        summary.setUnavailableVehicles(unavailableVehicles);
        summary.setUpcomingBookings(upcomingBookings);
        summary.setConfirmedBookings(confirmedBookings);
        summary.setCancelledBookings(cancelledBookings);
        summary.setCompletedBookings(completedBookings);
        summary.setTotalUsers(totalUsers);
        summary.setTotalDestinations(totalDestinations);
        summary.setActiveMaintenance(activeMaintenance);
        summary.setUnreadContactMessages(unreadMessages);
        summary.setRecentBookings(recentDtos);

        return summary;
    }
}

