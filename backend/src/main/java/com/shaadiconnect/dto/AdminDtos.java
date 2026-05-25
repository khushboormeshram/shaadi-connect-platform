package com.shaadiconnect.dto;

import java.math.BigDecimal;
import java.util.List;

public final class AdminDtos {
    private AdminDtos() {
    }

    public record DashboardStatsResponse(long totalVendors, long totalUsers, long totalBookings,
            BigDecimal totalRevenue) {
    }

    public record RecentBookingResponse(Long id, String vendorName, String customerName, BigDecimal amount,
            String status) {
    }

    public record TopVendorResponse(String name, long bookings) {
    }

    public record AdminDashboardResponse(DashboardStatsResponse stats, List<RecentBookingResponse> recentBookings,
            List<TopVendorResponse> topVendors) {
    }
}
