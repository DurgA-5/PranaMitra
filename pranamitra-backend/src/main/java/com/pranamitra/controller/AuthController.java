package com.pranamitra.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.request.DonorCompleteProfileRequest;
import com.pranamitra.dto.request.PatientCompleteProfileRequest;
import com.pranamitra.dto.request.ForgotPasswordRequest;
import com.pranamitra.dto.request.ResetPasswordRequest;
import com.pranamitra.dto.response.LoginResponse;
import com.pranamitra.dto.response.ProfileStatusResponse;
import com.pranamitra.payload.ApiResponse;
import com.pranamitra.service.AuthService;

import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.BloodBankRepository;
import com.pranamitra.service.BloodBankService;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.enums.RequestStatus;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final com.pranamitra.service.UserService userService;
    private final StudentDonorRepository studentDonorRepository;
    private final PatientRepository patientRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodBankRepository bloodBankRepository;
    private final BloodBankService bloodBankService;

    public AuthController(
            AuthService authService,
            com.pranamitra.service.UserService userService,
            StudentDonorRepository studentDonorRepository,
            PatientRepository patientRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodBankRepository bloodBankRepository,
            BloodBankService bloodBankService) {
        this.authService = authService;
        this.userService = userService;
        this.studentDonorRepository = studentDonorRepository;
        this.patientRepository = patientRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.bloodBankService = bloodBankService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<com.pranamitra.dto.response.UserResponse>> register(
            @Valid @RequestBody com.pranamitra.dto.request.UserRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "User registered successfully", userService.registerUser(request)));
    }

    @PostMapping("/register-donor")
    public ResponseEntity<ApiResponse<com.pranamitra.dto.response.UserResponse>> registerDonor(
            @Valid @RequestBody com.pranamitra.dto.request.UserRequest request) {
        request.setRole(com.pranamitra.enums.RoleType.DONOR);
        return ResponseEntity.ok(new ApiResponse<>(true, "Donor registered successfully", userService.registerUser(request)));
    }

    @PostMapping("/register-patient")
    public ResponseEntity<ApiResponse<com.pranamitra.dto.response.UserResponse>> registerPatient(
            @Valid @RequestBody com.pranamitra.dto.request.UserRequest request) {
        request.setRole(com.pranamitra.enums.RoleType.PATIENT);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient registered successfully", userService.registerUser(request)));
    }

    @GetMapping("/profile-status/{userId}")
    public ResponseEntity<ApiResponse<ProfileStatusResponse>> checkProfileStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile status checked successfully",
                        authService.checkProfileStatus(userId)));
    }

    @PostMapping("/complete-profile/donor/{userId}")
    public ResponseEntity<ApiResponse<String>> completeDonorProfile(
            @PathVariable Long userId,
            @Valid @RequestBody DonorCompleteProfileRequest request) {
        authService.completeDonorProfile(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Donor profile completed successfully.", null));
    }

    @PostMapping("/complete-profile/patient/{userId}")
    public ResponseEntity<ApiResponse<String>> completePatientProfile(
            @PathVariable Long userId,
            @Valid @RequestBody PatientCompleteProfileRequest request) {
        authService.completePatientProfile(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Patient profile completed successfully.", null));
    }

    @GetMapping("/me")
    public ResponseEntity<String> me() {
        return ResponseEntity.ok("JWT Working");
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getPublicStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalDonors", studentDonorRepository.count());
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalBloodRequests", bloodRequestRepository.count());
        stats.put("totalBloodBanks", bloodBankRepository.count());
        
        long completed = bloodRequestRepository.findAll().stream()
                .filter(r -> r.getRequestStatus() == RequestStatus.COMPLETED)
                .count();
        stats.put("livesSaved", completed);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/blood-banks")
    public ResponseEntity<List<BloodBankResponse>> getPublicBloodBanks() {
        return ResponseEntity.ok(bloodBankService.getAllBloodBanks());
    }

    @GetMapping("/blood-banks/city/{city}")
    public ResponseEntity<List<BloodBankResponse>> getPublicBloodBanksByCity(@PathVariable String city) {
        return ResponseEntity.ok(bloodBankService.getBloodBanksByCity(city));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        String token = authService.initiateForgotPassword(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Reset link generated successfully.", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password has been reset successfully.", null));
    }
}