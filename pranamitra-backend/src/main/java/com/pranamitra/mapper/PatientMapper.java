package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.PatientRequest;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.entity.Patient;

@Component
public class PatientMapper {

    // Convert Request DTO to Entity
    public Patient toEntity(PatientRequest request) {

        Patient patient = new Patient();

        patient.setPatientName(request.getPatientName());
        patient.setGender(request.getGender());
        patient.setAge(request.getAge());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setUnitsRequired(request.getUnitsRequired());
        patient.setHospitalName(request.getHospitalName());
        patient.setDoctorName(request.getDoctorName());
        patient.setAttenderName(request.getAttenderName());
        patient.setAttenderMobile(request.getAttenderMobile());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPincode(request.getPincode());
        patient.setRequiredDate(request.getRequiredDate());
        patient.setEmergencyLevel(request.getEmergencyLevel());

        return patient;
    }

    // Convert Entity to Response DTO
    public PatientResponse toResponse(Patient patient) {

        PatientResponse response = new PatientResponse();

        response.setId(patient.getId());
        response.setPatientName(patient.getPatientName());
        response.setGender(patient.getGender());
        response.setAge(patient.getAge());
        response.setBloodGroup(patient.getBloodGroup());
        response.setUnitsRequired(patient.getUnitsRequired());
        response.setHospitalName(patient.getHospitalName());
        response.setDoctorName(patient.getDoctorName());
        response.setAttenderName(patient.getAttenderName());
        response.setAttenderMobile(patient.getAttenderMobile());
        response.setAddress(patient.getAddress());
        response.setCity(patient.getCity());
        response.setState(patient.getState());
        response.setPincode(patient.getPincode());
        response.setRequiredDate(patient.getRequiredDate());
        response.setEmergencyLevel(patient.getEmergencyLevel());
        response.setRequestStatus(patient.getRequestStatus());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());

        return response;
    }
}