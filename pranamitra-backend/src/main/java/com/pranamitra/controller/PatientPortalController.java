package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.request.PatientPasswordUpdateRequest;
import com.pranamitra.dto.request.PatientProfileUpdateRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.PatientDashboardResponse;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.PatientPortalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient-portal")
@CrossOrigin(origins = "*")
public class PatientPortalController {

    private final PatientPortalService patientPortalService;

    public PatientPortalController(PatientPortalService patientPortalService) {
        this.patientPortalService = patientPortalService;
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────────

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<ApiResponse<PatientDashboardResponse>> getDashboardData(
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard data fetched successfully",
                patientPortalService.getDashboardData(userId)));
    }

    // ─── Profile ───────────────────────────────────────────────────────────────

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<PatientResponse>> getProfile(
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully",
                patientPortalService.getProfile(userId)));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<PatientResponse>> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody PatientProfileUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully",
                patientPortalService.updateProfile(userId, request)));
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @PathVariable Long userId,
            @Valid @RequestBody PatientPasswordUpdateRequest request) {
        patientPortalService.updatePassword(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password changed successfully", null));
    }

    // ─── Blood Requests ────────────────────────────────────────────────────────

    @PostMapping("/blood-requests/{userId}")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> createBloodRequest(
            @PathVariable Long userId,
            @Valid @RequestBody BloodRequestRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood request created successfully",
                patientPortalService.createBloodRequest(userId, request)));
    }

    @GetMapping("/blood-requests/{userId}")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getMyBloodRequests(
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood requests fetched successfully",
                patientPortalService.getMyBloodRequests(userId)));
    }

    @GetMapping("/blood-requests/{userId}/{requestId}")
    public ResponseEntity<ApiResponse<BloodRequestResponse>> getBloodRequestById(
            @PathVariable Long userId,
            @PathVariable Long requestId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood request fetched successfully",
                patientPortalService.getBloodRequestById(userId, requestId)));
    }

    @PutMapping("/blood-requests/{userId}/{requestId}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelBloodRequest(
            @PathVariable Long userId,
            @PathVariable Long requestId) {
        patientPortalService.cancelBloodRequest(userId, requestId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood request cancelled successfully", null));
    }

    // ─── Blood Banks ───────────────────────────────────────────────────────────

    @GetMapping("/blood-banks")
    public ResponseEntity<ApiResponse<List<BloodBankResponse>>> getAllBloodBanks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood banks fetched successfully",
                patientPortalService.getAllBloodBanks()));
    }

    @GetMapping("/blood-banks/city/{city}")
    public ResponseEntity<ApiResponse<List<BloodBankResponse>>> getBloodBanksByCity(
            @PathVariable String city) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Blood banks fetched successfully",
                patientPortalService.getBloodBanksByCity(city)));
    }

    // ─── Notifications ─────────────────────────────────────────────────────────

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<ApiResponse<List<String>>> getNotifications(
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully",
                patientPortalService.getNotifications(userId)));
    }
}
