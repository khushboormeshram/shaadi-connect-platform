package com.shaadiconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public final class PaymentDtos {
    private PaymentDtos() {
    }

    public record CreateOrderRequest(
            @NotNull BigDecimal amount,
            @NotBlank String currency,
            String purpose,
            String customerName,
            String customerEmail) {
    }

    public record CreateOrderResponse(String id, Long amount, String currency, String receipt, String status) {
    }

    public record VerifyPaymentRequest(
            @NotBlank String razorpayOrderId,
            @NotBlank String razorpayPaymentId,
            @NotBlank String razorpaySignature) {
    }

    public record RazorpayKeyResponse(String key) {
    }

    public record PaymentResponse(String status, String message) {
    }
}
