package com.shaadiconnect.config;

import com.shaadiconnect.entity.Booking;
import com.shaadiconnect.entity.BookingStatus;
import com.shaadiconnect.entity.User;
import com.shaadiconnect.entity.UserRole;
import com.shaadiconnect.entity.Vendor;
import com.shaadiconnect.repository.BookingRepository;
import com.shaadiconnect.repository.UserRepository;
import com.shaadiconnect.repository.VendorRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
            VendorRepository vendorRepository,
            BookingRepository bookingRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setEmail("admin@g.com");
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setSecurityAnswer(passwordEncoder.encode("admin"));
                admin.setRole(UserRole.ROLE_ADMIN);
                userRepository.save(admin);
            }

            if (vendorRepository.count() == 0) {
                vendorRepository.saveAll(List.of(
                        vendor("Royal Feast Catering", "Catering", "Catering", "Mumbai, Maharashtra",
                                "Royal Feast Catering specializes in creating memorable dining experiences.",
                                "contact@royalfeast.com | +91 98765 43210", 4.9, "₹800-1200/plate",
                                "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=300&fit=crop",
                                List.of("Indian Cuisine", "Continental", "Live Counters")),
                        vendor("Bloom & Blossom", "Flowers & Decor", "Flowers & Decor", "Delhi, NCR",
                                "Bloom & Blossom transforms venues with stunning floral arrangements.",
                                "info@bloomblossom.in | +91 87654 32109", 4.8, "₹50,000-2,00,000",
                                "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
                                List.of("Mandap Decor", "Floral Arrangements", "Stage Design")),
                        vendor("Capture Moments Studio", "Photography", "Photography", "Bangalore, Karnataka",
                                "Capture Moments Studio excels in candid photography and cinematic pre-wedding shoots.",
                                "studio@capturemoments.com | +91 76543 21098", 4.9, "₹75,000-1,50,000",
                                "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
                                List.of("Candid Photography", "Pre-wedding", "Drone Shots")),
                        vendor("Melody Masters", "Music & DJ", "Music & DJ", "Pune, Maharashtra",
                                "Melody Masters brings energy to your wedding with live bands and professional DJ services.",
                                "melody@masters.com | +91 65432 10987", 4.7, "₹25,000-75,000",
                                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                                List.of("Live Band", "DJ Services", "Sound System")),
                        vendor("Eternal Venues", "Venues", "Venues", "Jaipur, Rajasthan",
                                "Eternal Venues offers luxurious banquet halls and picturesque outdoor settings.",
                                "bookings@eternalvenues.in | +91 98765 12345", 4.6, "₹1,00,000-5,00,000",
                                "https://www.jaypeehotels.com/images/wedding-page/shubh-vivah-mobile-banner-02.jpg",
                                List.of("Banquet Halls", "Outdoor Venues", "Palace Weddings")),
                        vendor("Glamour Glow", "Makeup Artist", "Makeup Artist", "Hyderabad, Telangana",
                                "Glamour Glow provides top-tier bridal makeup services.",
                                "glamour@glow.com | +91 76543 34567", 4.9, "₹15,000-50,000",
                                "https://www.fabmood.com/inspiration/wp-content/uploads/2025/01/Bridal_Makeup_Looks_4722214-464x580.jpg",
                                List.of("Bridal Makeup", "Airbrush Makeup", "HD Makeup"))));
            }

            if (bookingRepository.count() == 0) {
                Vendor vendor = vendorRepository.findAll().stream().findFirst().orElse(null);
                if (vendor != null) {
                    bookingRepository.saveAll(List.of(
                            booking(vendor, "Priya & Raj", "priya@example.com", "+919876543210", "2026-12-15", "18:30",
                                    new BigDecimal("25000"), "UPI", "CONFIRMED", "VENDOR_BOOKING"),
                            booking(vendor, "Anjali & Vikram", "anjali@example.com", "+919876543211", "2026-12-18",
                                    "19:00", new BigDecimal("45000"), "online", "CONFIRMED", "VENDOR_BOOKING"),
                            booking(vendor, "Meera & Arjun", "meera@example.com", "+919876543212", "2026-12-20",
                                    "20:00", new BigDecimal("15000"), "online", "CONFIRMED", "VENDOR_BOOKING")));
                }
            }
        };
    }

    private Vendor vendor(String name, String service, String category, String location, String description,
            String contact, double rating, String price, String imageUrl, List<String> specialties) {
        Vendor vendor = new Vendor();
        vendor.setName(name);
        vendor.setService(service);
        vendor.setCategory(category);
        vendor.setLocation(location);
        vendor.setDescription(description);
        vendor.setContact(contact);
        vendor.setRating(rating);
        vendor.setPrice(price);
        vendor.setImageUrl(imageUrl);
        vendor.setSpecialties(specialties);
        vendor.setPortfolio(List.of(imageUrl));
        vendor.setVerified(Boolean.TRUE);
        return vendor;
    }

    private Booking booking(Vendor vendor, String customerName, String email, String phone, String eventDate,
            String eventTime, BigDecimal amount, String paymentMethod, String status, String purpose) {
        Booking booking = new Booking();
        booking.setVendor(vendor);
        booking.setCustomerName(customerName);
        booking.setCustomerEmail(email);
        booking.setCustomerPhone(phone);
        booking.setEventDate(eventDate);
        booking.setEventTime(eventTime);
        booking.setDepositAmount(amount);
        booking.setPaymentMethod(paymentMethod);
        booking.setStatus(BookingStatus.valueOf(status));
        booking.setPurpose(purpose);
        return booking;
    }
}
