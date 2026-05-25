package com.shaadiconnect.repository;

import com.shaadiconnect.entity.PaymentStatus;
import com.shaadiconnect.entity.PaymentTransaction;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByOrderId(String orderId);

    long countByStatus(PaymentStatus status);
}
