package com.shaadiconnect.repository;

import com.shaadiconnect.entity.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findTop5ByOrderByCreatedAtDesc();
}
