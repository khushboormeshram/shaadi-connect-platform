package com.shaadiconnect.service;

import com.shaadiconnect.dto.VendorDtos;
import com.shaadiconnect.entity.Vendor;
import com.shaadiconnect.exception.ResourceNotFoundException;
import com.shaadiconnect.repository.VendorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public VendorDtos.VendorListResponse listVendors() {
        List<VendorDtos.VendorResponse> vendors = vendorRepository.findAll().stream().map(this::toResponse).toList();
        return new VendorDtos.VendorListResponse(vendors);
    }

    public VendorDtos.VendorResponse getVendor(Long id) {
        return toResponse(getVendorEntity(id));
    }

    public VendorDtos.VendorResponse addVendor(VendorDtos.VendorRequest request) {
        Vendor vendor = new Vendor();
        applyRequest(vendor, request);
        return toResponse(vendorRepository.save(vendor));
    }

    public void deleteVendor(Long id) {
        vendorRepository.delete(getVendorEntity(id));
    }

    public Vendor getVendorEntity(Long id) {
        return vendorRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
    }

    private void applyRequest(Vendor vendor, VendorDtos.VendorRequest request) {
        vendor.setName(request.name());
        vendor.setService(request.service());
        vendor.setContact(request.contact());
        vendor.setCategory(request.category());
        vendor.setLocation(request.location());
        vendor.setDescription(request.description());
        vendor.setRating(request.rating());
        vendor.setPrice(request.price());
        vendor.setImageUrl(request.imageUrl());
        if (request.verified() != null) {
            vendor.setVerified(request.verified());
        }
        if (request.specialties() != null) {
            vendor.setSpecialties(request.specialties());
        }
        if (request.portfolio() != null) {
            vendor.setPortfolio(request.portfolio());
        }
    }

    private VendorDtos.VendorResponse toResponse(Vendor vendor) {
        return new VendorDtos.VendorResponse(
                vendor.getId(),
                vendor.getName(),
                vendor.getService(),
                vendor.getContact(),
                vendor.getCategory(),
                vendor.getLocation(),
                vendor.getRating(),
                vendor.getPrice(),
                vendor.getVerified());
    }
}
