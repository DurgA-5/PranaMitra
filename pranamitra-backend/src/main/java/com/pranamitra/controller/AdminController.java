package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.AvailableUserResponse;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.DashboardResponse;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.report.BloodGroupReportResponse;
import com.pranamitra.dto.response.report.CityReportResponse;
import com.pranamitra.dto.response.report.EmergencyLevelReportResponse;
import com.pranamitra.dto.response.report.RequestStatusReportResponse;
import com.pranamitra.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================================================
    // Dashboard
    // ==================================================

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                adminService.getDashboardStatistics());
    }

    // ==================================================
    // Student Donor Management
    // ==================================================

    @GetMapping("/donors")
    public ResponseEntity<List<StudentDonorResponse>> getAllDonors() {

        return ResponseEntity.ok(
                adminService.getAllDonors());
    }

    @PostMapping("/donors")
    public ResponseEntity<StudentDonorResponse> createDonor(
            @Valid @RequestBody StudentDonorRequest request) {

        return ResponseEntity.status(201)
                .body(adminService.createDonor(request));
    }

    @GetMapping("/available-users")
    public ResponseEntity<List<AvailableUserResponse>> getAvailableUsers() {
        return ResponseEntity.ok(adminService.getAvailableUsers());
    }

    @GetMapping("/donors/{id:\\d+}")
    public ResponseEntity<StudentDonorResponse> getDonorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getDonorById(id));
    }

    @PutMapping("/donors/{id:\\d+}/verify")
    public ResponseEntity<StudentDonorResponse> verifyDonor(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.verifyDonor(id));
    }

    @PutMapping("/donors/{id:\\d+}/activate")
    public ResponseEntity<StudentDonorResponse> toggleDonorStatus(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.toggleDonorStatus(id));
    }

    @DeleteMapping("/donors/{id:\\d+}")
    public ResponseEntity<String> deleteDonor(
            @PathVariable Long id) {

        adminService.deleteDonor(id);

        return ResponseEntity.ok(
                "Donor deleted successfully.");
    }

    // ==================================================
    // Patient Management
    // ==================================================

    @GetMapping("/patients")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {

        return ResponseEntity.ok(
                adminService.getAllPatients());
    }

    @GetMapping("/patients/{id:\\d+}")
    public ResponseEntity<PatientResponse> getPatientById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getPatientById(id));
    }

    @DeleteMapping("/patients/{id:\\d+}")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long id) {

        adminService.deletePatient(id);

        return ResponseEntity.ok(
                "Patient deleted successfully.");
    }
    // ==================================================
    // Blood Bank Management
    // ==================================================

    @PostMapping("/blood-banks")
    public ResponseEntity<BloodBankResponse> registerBloodBank(
            @Valid @RequestBody BloodBankRequest request) {

        return ResponseEntity.ok(
                adminService.registerBloodBank(request));
    }

    @GetMapping("/blood-banks")
    public ResponseEntity<List<BloodBankResponse>> getAllBloodBanks() {

        return ResponseEntity.ok(
                adminService.getAllBloodBanks());
    }

    @GetMapping("/blood-banks/{id:\\d+}")
    public ResponseEntity<BloodBankResponse> getBloodBankById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getBloodBankById(id));
    }

    @PutMapping("/blood-banks/{id:\\d+}")
    public ResponseEntity<BloodBankResponse> updateBloodBank(
            @PathVariable Long id,
            @Valid @RequestBody BloodBankRequest request) {

        return ResponseEntity.ok(
                adminService.updateBloodBank(id, request));
    }

    @DeleteMapping("/blood-banks/{id:\\d+}")
    public ResponseEntity<String> deleteBloodBank(
            @PathVariable Long id) {

        adminService.deleteBloodBank(id);

        return ResponseEntity.ok(
                "Blood Bank deleted successfully.");
    }

    @GetMapping("/blood-banks/city/{city}")
    public ResponseEntity<List<BloodBankResponse>> getBloodBanksByCity(
            @PathVariable String city) {

        return ResponseEntity.ok(
                adminService.getBloodBanksByCity(city));
    }

    // ==================================================
    // Blood Request Management
    // ==================================================

    @GetMapping("/blood-requests")
    public ResponseEntity<List<BloodRequestResponse>> getAllBloodRequests() {

        return ResponseEntity.ok(
                adminService.getAllBloodRequests());
    }

    @GetMapping("/blood-requests/{id:\\d+}")
    public ResponseEntity<BloodRequestResponse> getBloodRequestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.getBloodRequestById(id));
    }

    @PutMapping("/blood-requests/{id:\\d+}/approve")
    public ResponseEntity<BloodRequestResponse> approveBloodRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.approveBloodRequest(id));
    }

    @PutMapping("/blood-requests/{id:\\d+}/reject")
    public ResponseEntity<BloodRequestResponse> rejectBloodRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.rejectBloodRequest(id));
    }

    @PutMapping("/blood-requests/{id:\\d+}/complete")
    public ResponseEntity<BloodRequestResponse> completeBloodRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.completeBloodRequest(id));
    }

    @PutMapping("/blood-requests/{id:\\d+}/cancel")
    public ResponseEntity<BloodRequestResponse> cancelBloodRequest(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.cancelBloodRequest(id));
    }

    // ==================================================
    // Reports & Analytics
    // ==================================================

    @GetMapping("/reports")
    public ResponseEntity<com.pranamitra.dto.response.DashboardResponse> getGeneralReportSummary() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }


    @GetMapping("/reports/blood-groups")
    public ResponseEntity<List<BloodGroupReportResponse>> getBloodGroupStatistics() {

        return ResponseEntity.ok(
                adminService.getBloodGroupStatistics());
    }


    @GetMapping("/reports/request-status")
    public ResponseEntity<List<RequestStatusReportResponse>> getRequestStatusStatistics() {

        return ResponseEntity.ok(
                adminService.getRequestStatusStatistics());
    }

    @GetMapping("/reports/emergency-level")
    public ResponseEntity<List<EmergencyLevelReportResponse>> getEmergencyLevelStatistics() {

        return ResponseEntity.ok(
                adminService.getEmergencyLevelStatistics());
    }

    @GetMapping("/reports/cities")
    public ResponseEntity<List<CityReportResponse>> getCityStatistics() {

        return ResponseEntity.ok(
                adminService.getCityStatistics());
    }

    @GetMapping("/reports/active-blood-banks")
    public ResponseEntity<Long> getActiveBloodBanks() {

        return ResponseEntity.ok(
                adminService.getActiveBloodBankCount());
    }

    @GetMapping("/reports/twenty-four-hours")
    public ResponseEntity<Long> getTwentyFourHourBloodBanks() {

        return ResponseEntity.ok(
                adminService.getTwentyFourHourBloodBankCount());
    }

}