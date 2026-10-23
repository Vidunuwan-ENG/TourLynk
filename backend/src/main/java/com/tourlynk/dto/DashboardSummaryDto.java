package com.tourlynk.dto;

import java.util.List;

public class DashboardSummaryDto {
    private long totalVehicles;
    private long availableVehicles;
    private long unavailableVehicles;
    private long upcomingBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private long totalUsers;
    private long totalDestinations;
    private long activeMaintenance;
    private long unreadContactMessages;
    private List<BookingResponse> recentBookings;

    public DashboardSummaryDto() {}

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getAvailableVehicles() { return availableVehicles; }
    public void setAvailableVehicles(long availableVehicles) { this.availableVehicles = availableVehicles; }

    public long getUnavailableVehicles() { return unavailableVehicles; }
    public void setUnavailableVehicles(long unavailableVehicles) { this.unavailableVehicles = unavailableVehicles; }

    public long getUpcomingBookings() { return upcomingBookings; }
    public void setUpcomingBookings(long upcomingBookings) { this.upcomingBookings = upcomingBookings; }

    public long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

    public long getCancelledBookings() { return cancelledBookings; }
    public void setCancelledBookings(long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

    public long getCompletedBookings() { return completedBookings; }
    public void setCompletedBookings(long completedBookings) { this.completedBookings = completedBookings; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalDestinations() { return totalDestinations; }
    public void setTotalDestinations(long totalDestinations) { this.totalDestinations = totalDestinations; }

    public long getActiveMaintenance() { return activeMaintenance; }
    public void setActiveMaintenance(long activeMaintenance) { this.activeMaintenance = activeMaintenance; }

    public long getUnreadContactMessages() { return unreadContactMessages; }
    public void setUnreadContactMessages(long unreadContactMessages) { this.unreadContactMessages = unreadContactMessages; }

    public List<BookingResponse> getRecentBookings() { return recentBookings; }
    public void setRecentBookings(List<BookingResponse> recentBookings) { this.recentBookings = recentBookings; }
}

