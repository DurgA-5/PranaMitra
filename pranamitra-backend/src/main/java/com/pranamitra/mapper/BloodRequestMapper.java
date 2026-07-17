package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.Patient;

@Component
public class BloodRequestMapper {

    // Convert Request DTO to Entity
    public BloodRequest toEntity(BloodRequestRequest request, Patient patient) {

        BloodRequest bloodRequest = new BloodRequest();

        bloodRequest.setPatient(patient);
        bloodRequest.setBloodGroup(request.getBloodGroup());
        bloodRequest.setUnitsRequired(request.getUnitsRequired());
        bloodRequest.setEmergencyLevel(request.getEmergencyLevel());
        bloodRequest.setRequiredDate(request.getRequiredDate());
        bloodRequest.setRemarks(request.getRemarks());

        return bloodRequest;
    }

    // Convert Entity to Response DTO
    public BloodRequestResponse toResponse(BloodRequest bloodRequest) {

        BloodRequestResponse response = new BloodRequestResponse();

        response.setId(bloodRequest.getId());
        response.setRequestNumber(bloodRequest.getRequestNumber());

        response.setPatientId(bloodRequest.getPatient().getId());
        response.setPatientName(bloodRequest.getPatient().getPatientName());

        response.setBloodGroup(bloodRequest.getBloodGroup());
        response.setUnitsRequired(bloodRequest.getUnitsRequired());
        response.setEmergencyLevel(bloodRequest.getEmergencyLevel());
        response.setRequestStatus(bloodRequest.getRequestStatus());
        response.setRequiredDate(bloodRequest.getRequiredDate());
        response.setRemarks(bloodRequest.getRemarks());

        response.setCreatedAt(bloodRequest.getCreatedAt());
        response.setUpdatedAt(bloodRequest.getUpdatedAt());

        return response;
    }

}