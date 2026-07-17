package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.PatientRequest;
import com.pranamitra.dto.response.PatientResponse;

public interface PatientService {

    PatientResponse registerPatient(PatientRequest request);

    PatientResponse getPatientById(Long id);

    List<PatientResponse> getAllPatients();

    PatientResponse updatePatient(Long id, PatientRequest request);

    void deletePatient(Long id);

}