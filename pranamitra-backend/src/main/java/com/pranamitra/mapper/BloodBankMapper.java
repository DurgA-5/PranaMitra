package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.entity.BloodBank;

@Component
public class BloodBankMapper {

    // Request DTO -> Entity
    public BloodBank toEntity(BloodBankRequest request) {

        BloodBank bloodBank = new BloodBank();

        bloodBank.setBloodBankName(request.getBloodBankName());
        bloodBank.setLicenseNumber(request.getLicenseNumber());
        bloodBank.setEmail(request.getEmail());
        bloodBank.setMobileNumber(request.getMobileNumber());
        bloodBank.setAddress(request.getAddress());
        bloodBank.setCity(request.getCity());
        bloodBank.setState(request.getState());
        bloodBank.setPincode(request.getPincode());
        bloodBank.setManagerName(request.getManagerName());
        bloodBank.setOpeningTime(request.getOpeningTime());
        bloodBank.setClosingTime(request.getClosingTime());
        bloodBank.setAvailable24Hours(request.getAvailable24Hours());

        return bloodBank;
    }

    // Entity -> Response DTO
    public BloodBankResponse toResponse(BloodBank bloodBank) {

        BloodBankResponse response = new BloodBankResponse();

        response.setId(bloodBank.getId());
        response.setBloodBankName(bloodBank.getBloodBankName());
        response.setLicenseNumber(bloodBank.getLicenseNumber());
        response.setEmail(bloodBank.getEmail());
        response.setMobileNumber(bloodBank.getMobileNumber());
        response.setAddress(bloodBank.getAddress());
        response.setCity(bloodBank.getCity());
        response.setState(bloodBank.getState());
        response.setPincode(bloodBank.getPincode());
        response.setManagerName(bloodBank.getManagerName());
        response.setOpeningTime(bloodBank.getOpeningTime());
        response.setClosingTime(bloodBank.getClosingTime());
        response.setAvailable24Hours(bloodBank.getAvailable24Hours());
        response.setActive(bloodBank.getActive());
        response.setCreatedAt(bloodBank.getCreatedAt());
        response.setUpdatedAt(bloodBank.getUpdatedAt());

        return response;
    }
}