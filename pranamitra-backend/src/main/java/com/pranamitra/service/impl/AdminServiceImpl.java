package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.DashboardResponse;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.report.BloodGroupReportResponse;
import com.pranamitra.dto.response.report.EmergencyLevelReportResponse;
import com.pranamitra.dto.response.report.RequestStatusReportResponse;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.Patient;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.enums.RequestStatus;
import com.pranamitra.enums.EmergencyLevel;
import com.pranamitra.mapper.BloodRequestMapper;
import com.pranamitra.mapper.PatientMapper;
import com.pranamitra.mapper.StudentDonorMapper;
import com.pranamitra.repository.BloodBankRepository;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.ContactQueryRepository;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.enums.ContactStatus;
import com.pranamitra.service.AdminService;
import com.pranamitra.service.BloodBankService;
import com.pranamitra.service.StudentDonorService;
import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.EmergencyLevel;
import com.pranamitra.dto.response.report.CityReportResponse;
import com.pranamitra.dto.response.AvailableUserResponse;
@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentDonorRepository studentDonorRepository;
    private final PatientRepository patientRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodBankRepository bloodBankRepository;
    private final ContactQueryRepository contactQueryRepository;

    private final StudentDonorMapper studentDonorMapper;
    private final PatientMapper patientMapper;
    private final BloodRequestMapper bloodRequestMapper;

    // Blood Bank Service
    private final BloodBankService bloodBankService;
    private final StudentDonorService studentDonorService;
    private final com.pranamitra.service.NotificationService notificationService;

    public AdminServiceImpl(
            UserRepository userRepository,
            StudentDonorRepository studentDonorRepository,
            PatientRepository patientRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodBankRepository bloodBankRepository,
            ContactQueryRepository contactQueryRepository,
            StudentDonorMapper studentDonorMapper,
            PatientMapper patientMapper,
            BloodRequestMapper bloodRequestMapper,
            BloodBankService bloodBankService,
            StudentDonorService studentDonorService,
            com.pranamitra.service.NotificationService notificationService) {

        this.userRepository = userRepository;
        this.studentDonorRepository = studentDonorRepository;
        this.patientRepository = patientRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.contactQueryRepository = contactQueryRepository;
        this.studentDonorMapper = studentDonorMapper;
        this.patientMapper = patientMapper;
        this.bloodRequestMapper = bloodRequestMapper;
        this.bloodBankService = bloodBankService;
        this.studentDonorService = studentDonorService;
        this.notificationService = notificationService;
    }

    // ==================================================
    // Dashboard
    // ==================================================

    @Override
    public DashboardResponse getDashboardStatistics() {

        DashboardResponse dashboard = new DashboardResponse();

        dashboard.setTotalUsers(userRepository.count());

        dashboard.setTotalStudentDonors(studentDonorRepository.count());

        dashboard.setVerifiedDonors(
                (long) studentDonorRepository.findByVerifiedTrue().size());

        dashboard.setAvailableDonors(
                (long) studentDonorRepository.findByAvailableToDonateTrue().size());

        dashboard.setTotalPatients(patientRepository.count());

        dashboard.setTotalBloodRequests(
                bloodRequestRepository.count());

        dashboard.setPendingRequests(
                (long) bloodRequestRepository
                        .findByRequestStatus(RequestStatus.PENDING)
                        .size());

        dashboard.setCompletedRequests(
                (long) bloodRequestRepository
                        .findByRequestStatus(RequestStatus.COMPLETED)
                        .size());

        dashboard.setTotalBloodBanks(
                bloodBankRepository.count());

        dashboard.setEmergencyRequests(
                bloodRequestRepository.findAll().stream()
                        .filter(b -> b.getEmergencyLevel() == EmergencyLevel.CRITICAL || b.getEmergencyLevel() == EmergencyLevel.HIGH)
                        .count());

        dashboard.setNewContactQueries(
                contactQueryRepository.countByStatus(ContactStatus.NEW));

        return dashboard;
    }

    // ==================================================
    // Student Donor Management
    // ==================================================

    @Override
    public List<StudentDonorResponse> getAllDonors() {

        List<StudentDonorResponse> responseList = new ArrayList<>();

        List<StudentDonor> donors = studentDonorRepository.findAll();

        for (StudentDonor donor : donors) {

            responseList.add(studentDonorMapper.toResponse(donor));

        }

        return responseList;
    }

    @Override
    public StudentDonorResponse getDonorById(Long id) {

        StudentDonor donor = studentDonorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found."));

        return studentDonorMapper.toResponse(donor);
    }

    @Override
    public StudentDonorResponse createDonor(StudentDonorRequest request) {
        return studentDonorService.registerDonor(request);
    }

    @Override
    public StudentDonorResponse verifyDonor(Long id) {
        StudentDonor donor = studentDonorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found."));

        donor.setVerified(!donor.getVerified());
        StudentDonor saved = studentDonorRepository.save(donor);

        String statusStr = saved.getVerified() ? "VERIFIED" : "UNVERIFIED";
        notificationService.createNotification(saved.getUser(), "Profile Verified", 
            "Your donor profile has been " + statusStr.toLowerCase() + " by the administrator.", "SUCCESS");

        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Donor Verification Status", 
            "Donor profile " + saved.getUser().getFirstName() + " " + saved.getUser().getLastName() + " status updated to: " + statusStr + ".", "INFO");

        return studentDonorMapper.toResponse(saved);
    }

    @Override
    public StudentDonorResponse toggleDonorStatus(Long id) {
        StudentDonor donor = studentDonorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found."));

        donor.setActive(!donor.getActive());
        StudentDonor saved = studentDonorRepository.save(donor);

        String activeStr = saved.getActive() ? "activated" : "deactivated";
        notificationService.createNotification(saved.getUser(), "Account Activated/Deactivated", 
            "Your donor account has been " + activeStr + " by the administrator.", "INFO");

        return studentDonorMapper.toResponse(saved);
    }

    @Override
    public void deleteDonor(Long id) {

        if (!studentDonorRepository.existsById(id)) {

            throw new RuntimeException("Donor not found.");

        }

        studentDonorRepository.deleteById(id);
    }

    @Override
    public List<AvailableUserResponse> getAvailableUsers() {
        List<AvailableUserResponse> availableUsers = new java.util.ArrayList<>();
        for (com.pranamitra.entity.User user : userRepository.findAvailableUsersForDonor()) {
            String firstName = user.getFirstName() != null ? user.getFirstName() : "";
            String lastName = user.getLastName() != null ? user.getLastName() : "";
            String fullName = (firstName + " " + lastName).trim();
            availableUsers.add(new AvailableUserResponse(user.getId(), fullName, user.getEmail()));
        }
        return availableUsers;
    }

    // ==================================================
    // Patient Management
    // ==================================================

    @Override
    public List<PatientResponse> getAllPatients() {

        List<PatientResponse> responseList = new ArrayList<>();

        List<Patient> patients = patientRepository.findAll();

        for (Patient patient : patients) {

            responseList.add(patientMapper.toResponse(patient));

        }

        return responseList;
    }

    @Override
    public PatientResponse getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found."));

        return patientMapper.toResponse(patient);
    }

    @Override
    public void deletePatient(Long id) {

        if (!patientRepository.existsById(id)) {

            throw new RuntimeException("Patient not found.");

        }

        patientRepository.deleteById(id);
    }
    // ==================================================
    // Blood Request Management
    // ==================================================

    @Override
    public List<BloodRequestResponse> getAllBloodRequests() {

        List<BloodRequest> requests =
                bloodRequestRepository.findAll();

        List<BloodRequestResponse> responseList =
                new ArrayList<>();

        for (BloodRequest request : requests) {

            responseList.add(
                    bloodRequestMapper.toResponse(request));

        }

        return responseList;
    }

    @Override
    public BloodRequestResponse getBloodRequestById(Long id) {

        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        return bloodRequestMapper.toResponse(request);
    }

    @Override
    public BloodRequestResponse approveBloodRequest(Long id) {
        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException("Completed request cannot be approved.");
        }

        request.setRequestStatus(RequestStatus.APPROVED);
        BloodRequest saved = bloodRequestRepository.save(request);

        // Notify Patient
        notificationService.createNotification(saved.getPatient().getUser(), "Request Under Review", 
            "Your blood request " + saved.getRequestNumber() + " status is now approved and under review.", "SUCCESS");

        return bloodRequestMapper.toResponse(saved);
    }

    @Override
    public BloodRequestResponse rejectBloodRequest(Long id) {
        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException("Completed request cannot be rejected.");
        }

        request.setRequestStatus(RequestStatus.REJECTED);
        BloodRequest saved = bloodRequestRepository.save(request);

        // Notify Patient
        notificationService.createNotification(saved.getPatient().getUser(), "Blood Request Rejected", 
            "Your blood request " + saved.getRequestNumber() + " has been rejected by the administrator.", "DANGER");

        return bloodRequestMapper.toResponse(saved);
    }

    @Override
    public BloodRequestResponse completeBloodRequest(Long id) {
        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED requests can be completed.");
        }

        request.setRequestStatus(RequestStatus.COMPLETED);
        BloodRequest saved = bloodRequestRepository.save(request);

        // Notify Patient
        notificationService.createNotification(saved.getPatient().getUser(), "Blood Request Completed", 
            "Your blood request " + saved.getRequestNumber() + " has been completed successfully.", "SUCCESS");

        // Notify Admin
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Blood Request Completed", 
            "Blood request " + saved.getRequestNumber() + " has been marked as COMPLETED.", "SUCCESS");

        return bloodRequestMapper.toResponse(saved);
    }

    @Override
    public BloodRequestResponse cancelBloodRequest(Long id) {
        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() == RequestStatus.COMPLETED) {
            throw new RuntimeException("Completed request cannot be cancelled.");
        }

        request.setRequestStatus(RequestStatus.CANCELLED);
        BloodRequest saved = bloodRequestRepository.save(request);

        // Notify Patient
        notificationService.createNotification(saved.getPatient().getUser(), "Blood Request Cancelled", 
            "Your blood request " + saved.getRequestNumber() + " has been cancelled.", "INFO");

        return bloodRequestMapper.toResponse(saved);
    }

    // ==================================================
    // Blood Bank Management
    // ==================================================

    @Override
    public BloodBankResponse registerBloodBank(BloodBankRequest request) {

        return bloodBankService.registerBloodBank(request);

    }

    @Override
    public List<BloodBankResponse> getAllBloodBanks() {

        return bloodBankService.getAllBloodBanks();

    }

    @Override
    public BloodBankResponse getBloodBankById(Long id) {

        return bloodBankService.getBloodBankById(id);

    }

    @Override
    public BloodBankResponse updateBloodBank(
            Long id,
            BloodBankRequest request) {

        return bloodBankService.updateBloodBank(id, request);

    }

    @Override
    public void deleteBloodBank(Long id) {

        bloodBankService.deleteBloodBank(id);

    }

    @Override
    public List<BloodBankResponse> getBloodBanksByCity(String city) {

        return bloodBankService.getBloodBanksByCity(city);

    }
    
 // ==================================================
 // Reports & Analytics
 // ==================================================

 @Override
 public List<BloodGroupReportResponse> getBloodGroupStatistics() {

     List<Object[]> results =
             studentDonorRepository.getBloodGroupStatistics();

     List<BloodGroupReportResponse> responseList =
             new ArrayList<>();

     for (Object[] row : results) {

         BloodGroupReportResponse response =
                 new BloodGroupReportResponse();

         response.setBloodGroup((BloodGroup) row[0]);
         response.setTotalDonors((Long) row[1]);

         responseList.add(response);
     }

     return responseList;
 }

 @Override
 public List<RequestStatusReportResponse> getRequestStatusStatistics() {

     List<Object[]> results =
             bloodRequestRepository.getRequestStatusStatistics();

     List<RequestStatusReportResponse> responseList =
             new ArrayList<>();

     for (Object[] row : results) {

         RequestStatusReportResponse response =
                 new RequestStatusReportResponse();

         response.setRequestStatus((RequestStatus) row[0]);
         response.setTotalRequests((Long) row[1]);

         responseList.add(response);
     }

     return responseList;
 }

 @Override
 public List<EmergencyLevelReportResponse> getEmergencyLevelStatistics() {

     List<Object[]> results =
             bloodRequestRepository.getEmergencyLevelStatistics();

     List<EmergencyLevelReportResponse> responseList =
             new ArrayList<>();

     for (Object[] row : results) {

         EmergencyLevelReportResponse response =
                 new EmergencyLevelReportResponse();

         response.setEmergencyLevel((EmergencyLevel) row[0]);
         response.setTotalRequests((Long) row[1]);

         responseList.add(response);
     }

     return responseList;
 }
    
//==================================================
//Blood Bank Analytics
//==================================================
 @Override
 public List<CityReportResponse> getCityStatistics() {

     List<Object[]> results =
             studentDonorRepository.getCityStatistics();

     List<CityReportResponse> responseList =
             new ArrayList<>();

     for (Object[] row : results) {

         CityReportResponse response =
                 new CityReportResponse();

         response.setCity((String) row[0]);
         response.setTotalDonors((Long) row[1]);

         responseList.add(response);
     }

     return responseList;
 }
@Override
public Long getActiveBloodBankCount() {

  return bloodBankRepository.getActiveBloodBankCount();

}

@Override
public Long getTwentyFourHourBloodBankCount() {

  return bloodBankRepository.getTwentyFourHourBloodBankCount();

}

}