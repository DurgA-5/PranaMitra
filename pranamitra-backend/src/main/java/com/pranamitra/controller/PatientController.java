package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.PatientRequest;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@Validated
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Register Patient
    @PostMapping
    public ResponseEntity<PatientResponse> registerPatient(
            @Valid @RequestBody PatientRequest request) {

        PatientResponse response = patientService.registerPatient(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get All Patients
    @GetMapping
    public ResponseEntity<List<PatientResponse>> getAllPatients() {

        return ResponseEntity.ok(patientService.getAllPatients());
    }

    // Get Patient By ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<PatientResponse> getPatientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // Update Patient
    @PutMapping("/{id}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {

        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    // Delete Patient
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.ok("Patient deleted successfully.");
    }

}