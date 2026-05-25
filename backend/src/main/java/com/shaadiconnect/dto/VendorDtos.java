package com.shaadiconnect.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public final class VendorDtos {
    private VendorDtos() {
    }

    public record VendorRequest(
            @NotBlank String name,
            @NotBlank String service,
            @NotBlank String contact,
            String category,
            String location,
            String description,
            Double rating,
            String price,
            String imageUrl,
            Boolean verified,
            List<String> specialties,
            List<String> portfolio) {
    }

    public record VendorResponse(
            Long id,
            String name,
            String service,
            String contact,
            String category,
            String location,
            Double rating,
            String price,
            Boolean verified) {
    }

    public record VendorListResponse(List<VendorResponse> vendors) {
    }
}
