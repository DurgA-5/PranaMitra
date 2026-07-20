package com.pranamitra.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.request.PatientPasswordUpdateRequest;
import com.pranamitra.dto.request.PatientProfileUpdateRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.PatientDashboardResponse;
import com.pranamitra.dto.response.PatientResponse;
import com.pranamitra.entity.BloodBank;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.Patient;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.entity.User;
import com.pranamitra.enums.EmergencyLevel;
import com.pranamitra.enums.RequestStatus;
import com.pranamitra.mapper.BloodBankMapper;
import com.pranamitra.mapper.BloodRequestMapper;
import com.pranamitra.mapper.PatientMapper;
import com.pranamitra.repository.BloodBankRepository;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.PatientRepository;
import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.service.PatientPortalService;

@Service
@Transactional
public class PatientPortalServiceImpl implements PatientPortalService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final StudentDonorRepository studentDonorRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final BloodBankRepository bloodBankRepository;
    private final com.pranamitra.repository.DonationRepository donationRepository;
    private final PatientMapper patientMapper;
    private final BloodRequestMapper bloodRequestMapper;
    private final BloodBankMapper bloodBankMapper;
    private final PasswordEncoder passwordEncoder;
    private final com.pranamitra.service.NotificationService notificationService;

    public PatientPortalServiceImpl(
            UserRepository userRepository,
            PatientRepository patientRepository,
            StudentDonorRepository studentDonorRepository,
            BloodRequestRepository bloodRequestRepository,
            BloodBankRepository bloodBankRepository,
            com.pranamitra.repository.DonationRepository donationRepository,
            PatientMapper patientMapper,
            BloodRequestMapper bloodRequestMapper,
            BloodBankMapper bloodBankMapper,
            PasswordEncoder passwordEncoder,
            com.pranamitra.service.NotificationService notificationService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.studentDonorRepository = studentDonorRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.bloodBankRepository = bloodBankRepository;
        this.donationRepository = donationRepository;
        this.patientMapper = patientMapper;
        this.bloodRequestMapper = bloodRequestMapper;
        this.bloodBankMapper = bloodBankMapper;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    // ─── Internal helpers ──────────────────────────────────────────────────────

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    private Patient getPatientByUserId(Long userId) {
        User user = getUserById(userId);
        return patientRepository.findByUser(user)
                .orElseGet(() -> {
                    Patient p = new Patient();
                    p.setUser(user);
                    String name = (user.getFirstName() != null ? user.getFirstName() : "") + " " + (user.getLastName() != null ? user.getLastName() : "");
                    p.setPatientName(name.trim().isEmpty() ? "Emergency Patient" : name.trim());
                    p.setGender(com.pranamitra.enums.Gender.MALE);
                    p.setAge(30);
                    p.setBloodGroup(com.pranamitra.enums.BloodGroup.O_POSITIVE);
                    p.setUnitsRequired(1);
                    p.setHospitalName("Emergency Medical Care Center");
                    p.setDoctorName("Duty Medical Officer");
                    p.setAttenderName(p.getPatientName());
                    String mobile = user.getMobileNumber();
                    p.setAttenderMobile(mobile != null && mobile.length() == 10 ? mobile : "9876543210");
                    p.setAddress("Central Hospital Road");
                    p.setCity("Hyderabad");
                    p.setState("Telangana");
                    p.setPincode("500001");
                    p.setRequiredDate(java.time.LocalDate.now().plusDays(1));
                    p.setEmergencyLevel(com.pranamitra.enums.EmergencyLevel.MEDIUM);
                    p.setRequestStatus(com.pranamitra.enums.RequestStatus.PENDING);
                    return patientRepository.save(p);
                });
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────────

    @Override
    public PatientDashboardResponse getDashboardData(Long userId) {
        Patient patient = getPatientByUserId(userId);
        User user = patient.getUser();

        List<BloodRequest> requests = bloodRequestRepository.findByPatient(patient);

        long total = requests.size();
        long pending = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.PENDING).count();
        long active  = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.APPROVED).count();
        long completed = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.COMPLETED).count();
        long cancelled = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.CANCELLED).count();
        long emergency = requests.stream().filter(r -> r.getEmergencyLevel() == EmergencyLevel.HIGH).count();

        Optional<LocalDate> lastDate = requests.stream()
                .map(BloodRequest::getRequiredDate)
                .filter(d -> d != null)
                .max(Comparator.naturalOrder());

        PatientDashboardResponse response = new PatientDashboardResponse();
        response.setFullName(user.getFirstName() + " " + user.getLastName());
        response.setBloodGroup(patient.getBloodGroup());
        response.setHospitalName(patient.getHospitalName());
        response.setDoctorName(patient.getDoctorName());
        response.setCity(patient.getCity());
        response.setTotalRequests(total);
        response.setPendingRequests(pending);
        response.setActiveRequests(active);
        response.setCompletedRequests(completed);
        response.setCancelledRequests(cancelled);
        response.setEmergencyRequests(emergency);
        response.setLastRequestDate(lastDate.orElse(null));

        return response;
    }

    // ─── Profile ───────────────────────────────────────────────────────────────

    @Override
    public PatientResponse getProfile(Long userId) {
        Patient patient = getPatientByUserId(userId);
        return patientMapper.toResponse(patient);
    }

    @Override
    public PatientResponse updateProfile(Long userId, PatientProfileUpdateRequest request) {
        Patient patient = getPatientByUserId(userId);

        patient.setHospitalName(request.getHospitalName());
        patient.setDoctorName(request.getDoctorName());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPincode(request.getPincode());
        patient.setAttenderName(request.getAttenderName());
        patient.setAttenderMobile(request.getAttenderMobile());

        Patient updated = patientRepository.save(patient);
        return patientMapper.toResponse(updated);
    }

    @Override
    public void updatePassword(Long userId, PatientPasswordUpdateRequest request) {
        User user = getUserById(userId);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ─── Blood Requests ────────────────────────────────────────────────────────

    @Override
    public BloodRequestResponse createBloodRequest(Long userId, BloodRequestRequest request) {
        Patient patient = getPatientByUserId(userId);

        request.setPatientId(patient.getId());

        BloodRequest bloodRequest = bloodRequestMapper.toEntity(request, patient);
        bloodRequest.setRequestNumber("BR" + System.currentTimeMillis());

        BloodRequest saved = bloodRequestRepository.save(bloodRequest);

        // Notify Patient
        notificationService.createNotification(patient.getUser(), "Blood Request Submitted", 
            "Your blood request " + saved.getRequestNumber() + " for " + saved.getUnitsRequired() + " unit(s) of " + saved.getBloodGroup() + " has been submitted successfully.", "SUCCESS");

        // Notify Admin
        String title = "New Blood Request";
        String type = "INFO";
        if (saved.getEmergencyLevel() == com.pranamitra.enums.EmergencyLevel.CRITICAL || saved.getEmergencyLevel() == com.pranamitra.enums.EmergencyLevel.HIGH) {
            title = "Emergency Blood Request";
            type = "DANGER";
        }
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, title, 
            "Blood request " + saved.getRequestNumber() + " (" + saved.getBloodGroup() + ") has been created with urgency " + saved.getEmergencyLevel() + ".", type);

        // Notify Matching Donors
        List<StudentDonor> donors = studentDonorRepository.findByBloodGroup(saved.getBloodGroup());
        for (StudentDonor donor : donors) {
            if (Boolean.TRUE.equals(donor.getVerified()) && Boolean.TRUE.equals(donor.getActive()) && Boolean.TRUE.equals(donor.getAvailableToDonate())) {
                notificationService.createNotification(donor.getUser(), "New Matching Blood Request", 
                    "A new request (" + saved.getRequestNumber() + ") for blood group " + saved.getBloodGroup() + " requires matching donors.", "WARNING");
            }
        }

        return bloodRequestMapper.toResponse(saved);
    }

    private BloodRequestResponse enrichWithAssignedDonors(BloodRequest req) {
        BloodRequestResponse response = bloodRequestMapper.toResponse(req);
        List<java.util.Map<String, Object>> assignedDonorsList = new ArrayList<>();

        // 1. Check existing donations for this request
        List<com.pranamitra.entity.Donation> donations = donationRepository.findByBloodRequest(req);
        for (com.pranamitra.entity.Donation d : donations) {
            StudentDonor donor = d.getStudentDonor();
            if (donor != null && donor.getUser() != null) {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", donor.getId());
                map.put("name", donor.getUser().getFirstName() + " " + donor.getUser().getLastName());
                map.put("bloodGroup", donor.getBloodGroup() != null ? donor.getBloodGroup().name() : req.getBloodGroup().name());
                map.put("mobile", donor.getUser().getMobileNumber());
                map.put("college", donor.getCollegeName() != null ? donor.getCollegeName() : "University Campus");
                map.put("city", donor.getCity() != null ? donor.getCity() : req.getPatient().getCity());
                map.put("status", d.getStatus() != null ? d.getStatus().name() : "SCHEDULED");
                map.put("distance", "2.8 km");
                assignedDonorsList.add(map);
            }
        }

        // 2. If approved or matching and no specific donation records exist yet, match verified registered donors
        if (assignedDonorsList.isEmpty() && req.getRequestStatus() == RequestStatus.APPROVED) {
            List<StudentDonor> matchingDonors = studentDonorRepository.findByBloodGroup(req.getBloodGroup());
            for (StudentDonor donor : matchingDonors) {
                if (donor.getUser() != null && Boolean.TRUE.equals(donor.getActive())) {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", donor.getId());
                    map.put("name", donor.getUser().getFirstName() + " " + donor.getUser().getLastName());
                    map.put("bloodGroup", donor.getBloodGroup().name());
                    map.put("mobile", donor.getUser().getMobileNumber());
                    map.put("college", donor.getCollegeName() != null ? donor.getCollegeName() : "Medical College");
                    map.put("city", donor.getCity() != null ? donor.getCity() : req.getPatient().getCity());
                    map.put("status", Boolean.TRUE.equals(donor.getAvailableToDonate()) ? "AVAILABLE" : "ASSIGNED");
                    map.put("distance", "3.5 km");
                    assignedDonorsList.add(map);
                }
            }
        }

        response.setAssignedDonors(assignedDonorsList);
        return response;
    }

    @Override
    public List<BloodRequestResponse> getMyBloodRequests(Long userId) {
        Patient patient = getPatientByUserId(userId);
        List<BloodRequest> list = bloodRequestRepository.findByPatient(patient);
        return list.stream()
                .sorted(Comparator.comparing(BloodRequest::getCreatedAt).reversed())
                .map(this::enrichWithAssignedDonors)
                .collect(Collectors.toList());
    }

    @Override
    public BloodRequestResponse getBloodRequestById(Long userId, Long requestId) {
        Patient patient = getPatientByUserId(userId);
        BloodRequest req = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found with id: " + requestId));

        // Security: ensure the request belongs to this patient
        if (!req.getPatient().getId().equals(patient.getId())) {
            throw new IllegalAccessError("Access denied: this request does not belong to you.");
        }

        return enrichWithAssignedDonors(req);
    }

    @Override
    public void cancelBloodRequest(Long userId, Long requestId) {
        Patient patient = getPatientByUserId(userId);
        BloodRequest req = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Blood request not found with id: " + requestId));

        if (!req.getPatient().getId().equals(patient.getId())) {
            throw new IllegalAccessError("Access denied: this request does not belong to you.");
        }

        if (req.getRequestStatus() != RequestStatus.PENDING && req.getRequestStatus() != RequestStatus.APPROVED) {
            throw new IllegalStateException("Only PENDING or APPROVED requests can be cancelled.");
        }

        req.setRequestStatus(RequestStatus.CANCELLED);
        BloodRequest saved = bloodRequestRepository.save(req);

        // Notify Patient
        notificationService.createNotification(patient.getUser(), "Blood Request Cancelled", 
            "Your blood request " + saved.getRequestNumber() + " has been cancelled.", "INFO");

        // Notify Admin
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Blood Request Cancelled", 
            "Blood request " + saved.getRequestNumber() + " has been cancelled by the patient.", "INFO");
    }

    // ─── Blood Banks ───────────────────────────────────────────────────────────

    @Override
    public List<BloodBankResponse> getAllBloodBanks() {
        return bloodBankRepository.findAll().stream()
                .filter(b -> Boolean.TRUE.equals(b.getActive()))
                .map(bloodBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BloodBankResponse> getBloodBanksByCity(String city) {
        return bloodBankRepository.findByCityIgnoreCase(city).stream()
                .filter(b -> Boolean.TRUE.equals(b.getActive()))
                .map(bloodBankMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Notifications ─────────────────────────────────────────────────────────

    @Override
    public List<String> getNotifications(Long userId) {
        Patient patient = getPatientByUserId(userId);
        User user = patient.getUser();
        List<String> notifications = new ArrayList<>();

        notifications.add("Welcome to PranaMitra, " + user.getFirstName() + "! Your patient portal is ready.");

        List<BloodRequest> requests = bloodRequestRepository.findByPatient(patient);

        long pending = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.PENDING).count();
        if (pending > 0) {
            notifications.add("You have " + pending + " pending blood request(s) awaiting review.");
        }

        long active = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.APPROVED).count();
        if (active > 0) {
            notifications.add("Good news! " + active + " of your blood request(s) have been approved and a donor is being matched.");
        }

        long completed = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.COMPLETED).count();
        if (completed > 0) {
            notifications.add(completed + " blood request(s) have been successfully completed. Thank you for using PranaMitra.");
        }

        long cancelled = requests.stream().filter(r -> r.getRequestStatus() == RequestStatus.CANCELLED).count();
        if (cancelled > 0) {
            notifications.add(cancelled + " blood request(s) were cancelled.");
        }

        if (requests.isEmpty()) {
            notifications.add("No blood requests made yet. Use 'Request Blood' to create your first request.");
        }

        return notifications;
    }
}
