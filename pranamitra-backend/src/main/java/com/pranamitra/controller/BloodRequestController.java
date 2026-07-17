package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.service.BloodRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blood-requests")
@Validated
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;

    public BloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }

    // Create Blood Request
    @PostMapping
    public ResponseEntity<BloodRequestResponse> createBloodRequest(
            @Valid @RequestBody BloodRequestRequest request) {

        BloodRequestResponse response =
                bloodRequestService.createBloodRequest(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get All Blood Requests
    @GetMapping
    public ResponseEntity<List<BloodRequestResponse>> getAllBloodRequests() {

        return ResponseEntity.ok(
                bloodRequestService.getAllBloodRequests());
    }

    // Get Blood Request By ID
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<BloodRequestResponse> getBloodRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bloodRequestService.getBloodRequestById(id));
    }

    // Update Blood Request
    @PutMapping("/{id}")
    public ResponseEntity<BloodRequestResponse> updateBloodRequest(
            @PathVariable Long id,
            @Valid @RequestBody BloodRequestRequest request) {

        return ResponseEntity.ok(
                bloodRequestService.updateBloodRequest(id, request));
    }

    // Delete Blood Request
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBloodRequest(
            @PathVariable Long id) {

        bloodRequestService.deleteBloodRequest(id);

        return ResponseEntity.ok("Blood Request deleted successfully.");
    }

}