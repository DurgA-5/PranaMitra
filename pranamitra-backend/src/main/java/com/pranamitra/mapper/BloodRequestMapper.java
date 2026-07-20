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

        Patient patient = bloodRequest.getPatient();
        if (patient != null) {
            response.setPatientId(patient.getId());
            String pName = patient.getPatientName();
            if (pName == null || pName.trim().isEmpty()) {
                if (patient.getUser() != null) {
                    pName = patient.getUser().getFirstName() + " " + patient.getUser().getLastName();
                } else {
                    pName = "Emergency Patient";
                }
            }
            response.setPatientName(pName);
            response.setHospitalName(patient.getHospitalName() != null ? patient.getHospitalName() : "Emergency Medical Center");
            response.setDoctorName(patient.getDoctorName() != null ? patient.getDoctorName() : "Duty Doctor");
            response.setHospitalAddress(patient.getAddress() != null ? patient.getAddress() : "Medical Campus");
            response.setCity(patient.getCity() != null ? patient.getCity() : "City Center");
            response.setState(patient.getState() != null ? patient.getState() : "State");
            response.setPincode(patient.getPincode() != null ? patient.getPincode() : "500001");
            if (patient.getUser() != null) {
                response.setPatientMobile(patient.getUser().getMobileNumber());
            } else {
                response.setPatientMobile("9876543210");
            }
            response.setAttenderName(patient.getAttenderName());
            response.setAttenderMobile(patient.getAttenderMobile() != null ? patient.getAttenderMobile() : "9876543210");
            response.setDistance("3.2 km");
        }

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