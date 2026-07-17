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
import com.pranamitra.mapper.BloodRequestMapper;
import com.pranamitra.mapper.PatientMapper;
import com.pranamitra.mapper.StudentDonorMapper;
import com.pranamitra.repository.BloodBankRepository;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.service.AdminService;
import com.pranamitra.service.BloodBankService;
import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.EmergencyLevel;
import com.pranamitra.dto.response.report.CityReportResponse;
@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentDonorRepository studentDonorRepository;
    private final PatientRepository patientRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodBankRepository bloodBankRepository;

    private final StudentDonorMapper studentDonorMapper;
    private final PatientMapper patientMapper;
    private final BloodRequestMapper bloodRequestMapper;

    // Blood Bank Service
    private final BloodBankService bloodBankService;

    public AdminServiceImpl(
            UserRepository userRepository,
            StudentDonorRepository studentDonorRepository,
            PatientRepository patientRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodBankRepository bloodBankRepository,
            StudentDonorMapper studentDonorMapper,
            PatientMapper patientMapper,
            BloodRequestMapper bloodRequestMapper,
            BloodBankService bloodBankService) {

        this.userRepository = userRepository;
        this.studentDonorRepository = studentDonorRepository;
        this.patientRepository = patientRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.studentDonorMapper = studentDonorMapper;
        this.patientMapper = patientMapper;
        this.bloodRequestMapper = bloodRequestMapper;
        this.bloodBankService = bloodBankService;
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
    public StudentDonorResponse verifyDonor(Long id) {

        StudentDonor donor = studentDonorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found."));

        donor.setVerified(true);

        return studentDonorMapper.toResponse(
                studentDonorRepository.save(donor));
    }

    @Override
    public StudentDonorResponse toggleDonorStatus(Long id) {

        StudentDonor donor = studentDonorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found."));

        donor.setActive(!donor.getActive());

        return studentDonorMapper.toResponse(
                studentDonorRepository.save(donor));
    }

    @Override
    public void deleteDonor(Long id) {

        if (!studentDonorRepository.existsById(id)) {

            throw new RuntimeException("Donor not found.");

        }

        studentDonorRepository.deleteById(id);
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

            throw new RuntimeException(
                    "Completed request cannot be approved.");

        }

        request.setRequestStatus(RequestStatus.APPROVED);

        return bloodRequestMapper.toResponse(
                bloodRequestRepository.save(request));
    }

    @Override
    public BloodRequestResponse rejectBloodRequest(Long id) {

        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() == RequestStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed request cannot be rejected.");

        }

        request.setRequestStatus(RequestStatus.REJECTED);

        return bloodRequestMapper.toResponse(
                bloodRequestRepository.save(request));
    }

    @Override
    public BloodRequestResponse completeBloodRequest(Long id) {

        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() != RequestStatus.APPROVED) {

            throw new RuntimeException(
                    "Only APPROVED requests can be completed.");

        }

        request.setRequestStatus(RequestStatus.COMPLETED);

        return bloodRequestMapper.toResponse(
                bloodRequestRepository.save(request));
    }

    @Override
    public BloodRequestResponse cancelBloodRequest(Long id) {

        BloodRequest request =
                bloodRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Blood Request not found."));

        if (request.getRequestStatus() == RequestStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed request cannot be cancelled.");

        }

        request.setRequestStatus(RequestStatus.CANCELLED);

        return bloodRequestMapper.toResponse(
                bloodRequestRepository.save(request));
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