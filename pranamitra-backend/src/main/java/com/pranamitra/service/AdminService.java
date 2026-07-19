package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.DashboardResponse;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.report.BloodGroupReportResponse;
import com.pranamitra.dto.response.report.CityReportResponse;
import com.pranamitra.dto.response.report.EmergencyLevelReportResponse;
import com.pranamitra.dto.response.report.RequestStatusReportResponse;
import com.pranamitra.dto.response.AvailableUserResponse;

public interface AdminService {

    // ==================================================
    // Dashboard
    // ==================================================

    DashboardResponse getDashboardStatistics();

    // ==================================================
    // Student Donor Management
    // ==================================================

    List<StudentDonorResponse> getAllDonors();

    StudentDonorResponse getDonorById(Long id);

    StudentDonorResponse createDonor(StudentDonorRequest request);

    StudentDonorResponse verifyDonor(Long id);

    StudentDonorResponse toggleDonorStatus(Long id);

    void deleteDonor(Long id);

    List<AvailableUserResponse> getAvailableUsers();

    // ==================================================
    // Patient Management
    // ==================================================

    List<PatientResponse> getAllPatients();

    PatientResponse getPatientById(Long id);

    void deletePatient(Long id);

    // ==================================================
    // Blood Request Management
    // ==================================================

    List<BloodRequestResponse> getAllBloodRequests();

    BloodRequestResponse getBloodRequestById(Long id);

    BloodRequestResponse approveBloodRequest(Long id);

    BloodRequestResponse rejectBloodRequest(Long id);

    BloodRequestResponse completeBloodRequest(Long id);

    BloodRequestResponse cancelBloodRequest(Long id);

    // ==================================================
    // Blood Bank Management
    // ==================================================

    BloodBankResponse registerBloodBank(BloodBankRequest request);

    List<BloodBankResponse> getAllBloodBanks();

    BloodBankResponse getBloodBankById(Long id);

    BloodBankResponse updateBloodBank(Long id, BloodBankRequest request);

    void deleteBloodBank(Long id);

    List<BloodBankResponse> getBloodBanksByCity(String city);

    
 // ==================================================
 // Reports & Analytics
 // ==================================================

 List<BloodGroupReportResponse> getBloodGroupStatistics();

 List<RequestStatusReportResponse> getRequestStatusStatistics();

 List<EmergencyLevelReportResponse> getEmergencyLevelStatistics();

 List<CityReportResponse> getCityStatistics();

 Long getActiveBloodBankCount();

 Long getTwentyFourHourBloodBankCount();
}
