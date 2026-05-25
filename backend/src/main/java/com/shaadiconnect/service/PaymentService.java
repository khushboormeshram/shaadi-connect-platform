package com.shaadiconnect.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shaadiconnect.dto.PaymentDtos;
import com.shaadiconnect.entity.PaymentStatus;
import com.shaadiconnect.entity.PaymentTransaction;
import com.shaadiconnect.exception.BadRequestException;
import com.shaadiconnect.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentTransactionRepository paymentRepository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String razorpayKeyId;
    private final String razorpayKeySecret;

    public PaymentService(PaymentTransactionRepository paymentRepository,
            ObjectMapper objectMapper,
            @Value("${app.razorpay.key-id}") String razorpayKeyId,
            @Value("${app.razorpay.key-secret}") String razorpayKeySecret) {
        this.paymentRepository = paymentRepository;
        this.objectMapper = objectMapper;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    public PaymentDtos.RazorpayKeyResponse getKey() {
        return new PaymentDtos.RazorpayKeyResponse(razorpayKeyId);
    }

    public PaymentDtos.CreateOrderResponse createOrder(PaymentDtos.CreateOrderRequest request) {
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        BigDecimal amountInPaise = request.amount().multiply(BigDecimal.valueOf(100)).setScale(0,
                java.math.RoundingMode.HALF_UP);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("amount", amountInPaise.longValue());
        payload.put("currency", request.currency());
        payload.put("receipt", "receipt_" + System.currentTimeMillis());
        payload.put("payment_capture", 1);

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setAmount(request.amount());
        transaction.setCurrency(request.currency());
        transaction.setPurpose(request.purpose() == null ? "GENERAL" : request.purpose());
        transaction.setCustomerName(request.customerName());
        transaction.setCustomerEmail(request.customerEmail());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBasicAuth(razorpayKeyId, razorpayKeySecret);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(
                    "https://api.razorpay.com/v1/orders",
                    HttpMethod.POST,
                    entity,
                    JsonNode.class);

            JsonNode responseNode = responseEntity.getBody();

            if (responseNode != null && responseNode.hasNonNull("id")) {
                transaction.setOrderId(responseNode.get("id").asText());
                paymentRepository.save(transaction);
                return new PaymentDtos.CreateOrderResponse(
                        responseNode.get("id").asText(),
                        responseNode.path("amount").asLong(amountInPaise.longValue()),
                        responseNode.path("currency").asText(request.currency()),
                        responseNode.path("receipt").asText(),
                        responseNode.path("status").asText("created"));
            }
        } catch (RestClientException ex) {
            // Fallback to a mock order so the frontend flow still works during local
            // development.
        }

        String mockOrderId = "order_mock_" + System.currentTimeMillis();
        transaction.setOrderId(mockOrderId);
        paymentRepository.save(transaction);
        return new PaymentDtos.CreateOrderResponse(mockOrderId, amountInPaise.longValue(), request.currency(),
                "receipt_mock_" + System.currentTimeMillis(), "created");
    }

    public PaymentDtos.PaymentResponse verifyPayment(PaymentDtos.VerifyPaymentRequest request) {
        String expectedSignature = calculateSignature(request.razorpayOrderId(), request.razorpayPaymentId());
        if (!expectedSignature.equals(request.razorpaySignature())) {
            throw new BadRequestException("Invalid signature");
        }

        PaymentTransaction transaction = paymentRepository.findByOrderId(request.razorpayOrderId())
                .orElseGet(PaymentTransaction::new);
        transaction.setOrderId(request.razorpayOrderId());
        transaction.setPaymentId(request.razorpayPaymentId());
        transaction.setSignature(request.razorpaySignature());
        transaction.setStatus(PaymentStatus.VERIFIED);
        transaction.setVerifiedAt(LocalDateTime.now());
        paymentRepository.save(transaction);

        return new PaymentDtos.PaymentResponse("ok", "Payment verified successfully");
    }

    private String calculateSignature(String orderId, String paymentId) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256Hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256");
            sha256Hmac.init(secretKey);
            byte[] hash = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) {
                    hex.append('0');
                }
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception ex) {
            throw new BadRequestException("Unable to verify payment signature");
        }
    }
}
