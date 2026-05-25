package com.shaadiconnect.service;

import com.shaadiconnect.dto.AdminDtos;
import com.shaadiconnect.entity.Booking;
import com.shaadiconnect.entity.BookingStatus;
import com.shaadiconnect.entity.Vendor;
import com.shaadiconnect.repository.BookingRepository;
import com.shaadiconnect.repository.UserRepository;
import com.shaadiconnect.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AdminService(VendorRepository vendorRepository, UserRepository userRepository,
            BookingRepository bookingRepository) {
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public AdminDtos.DashboardStatsResponse stats() {
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .map(booking -> booking.getDepositAmount() == null ? BigDecimal.ZERO : booking.getDepositAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new AdminDtos.DashboardStatsResponse(
                vendorRepository.count(),
                userRepository.count(),
                bookingRepository.count(),
                totalRevenue);
    }

    public AdminDtos.AdminDashboardResponse dashboard() {
        List<AdminDtos.RecentBookingResponse> recentBookings = bookingRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::toRecentBooking)
                .toList();

        Map<String, Long> bookingsByVendor = bookingRepository.findAll().stream()
                .filter(booking -> booking.getVendor() != null)
                .collect(Collectors.groupingBy(booking -> booking.getVendor().getName(), Collectors.counting()));

        List<AdminDtos.TopVendorResponse> topVendors = bookingsByVendor.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
                .limit(5)
                .map(entry -> new AdminDtos.TopVendorResponse(entry.getKey(), entry.getValue()))
                .toList();

        return new AdminDtos.AdminDashboardResponse(stats(), recentBookings, topVendors);
    }

    private AdminDtos.RecentBookingResponse toRecentBooking(Booking booking) {
        String vendorName = booking.getVendor() == null ? "General Booking" : booking.getVendor().getName();
        return new AdminDtos.RecentBookingResponse(booking.getId(), vendorName, booking.getCustomerName(),
                booking.getDepositAmount(), booking.getStatus().name());
    }
}
