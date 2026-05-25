package com.shaadiconnect.controller;

import com.shaadiconnect.dto.VendorDtos;
import com.shaadiconnect.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public VendorDtos.VendorListResponse listVendors() {
        return vendorService.listVendors();
    }

    @GetMapping("/{id}")
    public VendorDtos.VendorResponse getVendor(@PathVariable Long id) {
        return vendorService.getVendor(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VendorDtos.VendorResponse> addVendor(@Valid @RequestBody VendorDtos.VendorRequest request) {
        return ResponseEntity.status(201).body(vendorService.addVendor(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok(Map.of("message", "Vendor deleted successfully"));
    }
}
