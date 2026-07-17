package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.Patient;
import com.pranamitra.mapper.BloodRequestMapper;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.service.BloodRequestService;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;
    private final PatientRepository patientRepository;
    private final BloodRequestMapper bloodRequestMapper;

    public BloodRequestServiceImpl(
            BloodRequestRepository bloodRequestRepository,
            PatientRepository patientRepository,
            BloodRequestMapper bloodRequestMapper) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.patientRepository = patientRepository;
        this.bloodRequestMapper = bloodRequestMapper;
    }

    @Override
    public BloodRequestResponse createBloodRequest(BloodRequestRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found."));

        BloodRequest bloodRequest = bloodRequestMapper.toEntity(request, patient);

        // Generate Request Number
        String requestNumber = "BR" + System.currentTimeMillis();

        bloodRequest.setRequestNumber(requestNumber);

        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);

        return bloodRequestMapper.toResponse(savedRequest);
    }

    @Override
    public BloodRequestResponse getBloodRequestById(Long id) {

        BloodRequest bloodRequest = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Request not found."));

        return bloodRequestMapper.toResponse(bloodRequest);
    }

    @Override
    public List<BloodRequestResponse> getAllBloodRequests() {

        List<BloodRequest> requests = bloodRequestRepository.findAll();

        List<BloodRequestResponse> responseList = new ArrayList<>();

        for (BloodRequest request : requests) {
            responseList.add(bloodRequestMapper.toResponse(request));
        }

        return responseList;
    }

    @Override
    public BloodRequestResponse updateBloodRequest(Long id, BloodRequestRequest request) {

        BloodRequest bloodRequest = bloodRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood Request not found."));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found."));

        bloodRequest.setPatient(patient);
        bloodRequest.setBloodGroup(request.getBloodGroup());
        bloodRequest.setUnitsRequired(request.getUnitsRequired());
        bloodRequest.setEmergencyLevel(request.getEmergencyLevel());
        bloodRequest.setRequiredDate(request.getRequiredDate());
        bloodRequest.setRemarks(request.getRemarks());

        BloodRequest updatedRequest = bloodRequestRepository.save(bloodRequest);

        return bloodRequestMapper.toResponse(updatedRequest);
    }

    @Override
    public void deleteBloodRequest(Long id) {

        if (!bloodRequestRepository.existsById(id)) {
            throw new RuntimeException("Blood Request not found.");
        }

        bloodRequestRepository.deleteById(id);
    }

}