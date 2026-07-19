package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.DonorPasswordUpdateRequest;
import com.pranamitra.dto.request.DonorProfileUpdateRequest;
import com.pranamitra.dto.response.DonationResponse;
import com.pranamitra.dto.response.DonorDashboardResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.DonorPortalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/donor-portal")
@CrossOrigin(origins = "*")
public class DonorPortalController {

    private final DonorPortalService donorPortalService;

    public DonorPortalController(DonorPortalService donorPortalService) {
        this.donorPortalService = donorPortalService;
    }

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<ApiResponse<DonorDashboardResponse>> getDashboardData(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Dashboard stats fetched successfully",
                        donorPortalService.getDashboardData(userId)));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<StudentDonorResponse>> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile details fetched successfully",
                        donorPortalService.getDonorProfile(userId)));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<StudentDonorResponse>> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody DonorProfileUpdateRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile updated successfully",
                        donorPortalService.updateDonorProfile(userId, request)));
    }

    @PutMapping("/password/{userId}")
    public ResponseEntity<ApiResponse<String>> updatePassword(
            @PathVariable Long userId,
            @Valid @RequestBody DonorPasswordUpdateRequest request) {
        donorPortalService.updatePassword(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password changed successfully", null));
    }

    @PutMapping("/availability/{userId}")
    public ResponseEntity<ApiResponse<StudentDonorResponse>> toggleAvailability(
            @PathVariable Long userId,
            @RequestParam boolean available) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Availability status updated successfully",
                        donorPortalService.toggleAvailability(userId, available)));
    }

    @GetMapping("/matching-requests/{userId}")
    public ResponseEntity<ApiResponse<List<BloodRequestResponse>>> getMatchingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Matching requests fetched successfully",
                        donorPortalService.getMatchingRequests(userId)));
    }

    @PostMapping("/requests/{requestId}/accept/{userId}")
    public ResponseEntity<ApiResponse<String>> acceptRequest(
            @PathVariable Long requestId,
            @PathVariable Long userId) {
        donorPortalService.acceptRequest(requestId, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Request accepted successfully. Donation scheduled.", null));
    }

    @PostMapping("/requests/{requestId}/decline/{userId}")
    public ResponseEntity<ApiResponse<String>> declineRequest(
            @PathVariable Long requestId,
            @PathVariable Long userId) {
        donorPortalService.declineRequest(requestId, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Request declined successfully.", null));
    }

    @GetMapping("/accepted-requests/{userId}")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getAcceptedRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Accepted requests fetched successfully",
                        donorPortalService.getAcceptedRequests(userId)));
    }

    @PutMapping("/donations/{donationId}/complete/{userId}")
    public ResponseEntity<ApiResponse<String>> completeDonation(
            @PathVariable Long donationId,
            @PathVariable Long userId) {
        donorPortalService.completeDonation(donationId, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donation completed successfully.", null));
    }

    @PutMapping("/donations/{donationId}/cancel/{userId}")
    public ResponseEntity<ApiResponse<String>> cancelDonation(
            @PathVariable Long donationId,
            @PathVariable Long userId) {
        donorPortalService.cancelDonation(donationId, userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donation cancelled successfully.", null));
    }

    @GetMapping("/donation-history/{userId}")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getDonationHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donation history fetched successfully",
                        donorPortalService.getDonationHistory(userId)));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<ApiResponse<List<String>>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Notifications fetched successfully",
                        donorPortalService.getNotifications(userId)));
    }
}
