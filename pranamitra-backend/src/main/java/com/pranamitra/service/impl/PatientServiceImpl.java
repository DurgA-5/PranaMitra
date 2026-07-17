package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.PatientRequest;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.entity.Patient;
import com.pranamitra.mapper.PatientMapper;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.service.PatientService;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientServiceImpl(PatientRepository patientRepository,
                              PatientMapper patientMapper) {

        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
    }

    @Override
    public PatientResponse registerPatient(PatientRequest request) {

        Patient patient = patientMapper.toEntity(request);

        Patient savedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(savedPatient);
    }

    @Override
    public PatientResponse getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found."));

        return patientMapper.toResponse(patient);
    }

    @Override
    public List<PatientResponse> getAllPatients() {

        List<Patient> patients = patientRepository.findAll();

        List<PatientResponse> responses = new ArrayList<>();

        for (Patient patient : patients) {
            responses.add(patientMapper.toResponse(patient));
        }

        return responses;
    }

    @Override
    public PatientResponse updatePatient(Long id, PatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found."));

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

        Patient updatedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(updatedPatient);
    }

    @Override
    public void deletePatient(Long id) {

        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found.");
        }

        patientRepository.deleteById(id);
    }

}