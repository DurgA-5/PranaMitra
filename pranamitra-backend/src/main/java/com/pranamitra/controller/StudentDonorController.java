package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.StudentDonorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class StudentDonorController {

    private final StudentDonorService donorService;

    public StudentDonorController(StudentDonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentDonorResponse>> registerDonor(
            @Valid @RequestBody StudentDonorRequest request) {

        StudentDonorResponse response = donorService.registerDonor(request);

        return new ResponseEntity<>(
                new ApiResponse<>(true, "Donor registered successfully", response),
                HttpStatus.CREATED);
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse<StudentDonorResponse>> getDonor(@PathVariable Long id) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donor fetched successfully",
                        donorService.getDonorById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentDonorResponse>>> getAllDonors() {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donors fetched successfully",
                        donorService.getAllDonors()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentDonorResponse>> updateDonor(
            @PathVariable Long id,
            @Valid @RequestBody StudentDonorRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donor updated successfully",
                        donorService.updateDonor(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDonor(@PathVariable Long id) {

        donorService.deleteDonor(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donor deleted successfully", null));
    }
}