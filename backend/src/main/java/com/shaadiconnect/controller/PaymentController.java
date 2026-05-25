package com.shaadiconnect.controller;

import com.shaadiconnect.dto.PaymentDtos;
import com.shaadiconnect.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/razorpay-key")
    public ResponseEntity<PaymentDtos.RazorpayKeyResponse> razorpayKey() {
        return ResponseEntity.ok(paymentService.getKey());
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentDtos.CreateOrderResponse> createOrder(
            @Valid @RequestBody PaymentDtos.CreateOrderRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<PaymentDtos.PaymentResponse> verifyPayment(
            @Valid @RequestBody PaymentDtos.VerifyPaymentRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }
}
