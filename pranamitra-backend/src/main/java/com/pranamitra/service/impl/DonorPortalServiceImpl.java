package com.pranamitra.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pranamitra.dto.request.DonorPasswordUpdateRequest;
import com.pranamitra.dto.request.DonorProfileUpdateRequest;
import com.pranamitra.dto.response.DonationResponse;
import com.pranamitra.dto.response.DonorDashboardResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.entity.*;
import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.DonationStatus;
import com.pranamitra.enums.RequestStatus;
import com.pranamitra.mapper.StudentDonorMapper;
import com.pranamitra.repository.*;
import com.pranamitra.service.DonorPortalService;

@Service
@Transactional
public class DonorPortalServiceImpl implements DonorPortalService {

    private final UserRepository userRepository;
    private final StudentDonorRepository studentDonorRepository;
    private final PatientRepository patientRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final DonationRepository donationRepository;
    private final DeclinedRequestRepository declinedRequestRepository;
    private final StudentDonorMapper studentDonorMapper;
    private final com.pranamitra.mapper.BloodRequestMapper bloodRequestMapper;
    private final PasswordEncoder passwordEncoder;
    private final com.pranamitra.service.NotificationService notificationService;

    public DonorPortalServiceImpl(
            UserRepository userRepository,
            StudentDonorRepository studentDonorRepository,
            PatientRepository patientRepository,
            BloodRequestRepository bloodRequestRepository,
            DonationRepository donationRepository,
            DeclinedRequestRepository declinedRequestRepository,
            StudentDonorMapper studentDonorMapper,
            com.pranamitra.mapper.BloodRequestMapper bloodRequestMapper,
            PasswordEncoder passwordEncoder,
            com.pranamitra.service.NotificationService notificationService) {
        this.userRepository = userRepository;
        this.studentDonorRepository = studentDonorRepository;
        this.patientRepository = patientRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.donationRepository = donationRepository;
        this.declinedRequestRepository = declinedRequestRepository;
        this.studentDonorMapper = studentDonorMapper;
        this.bloodRequestMapper = bloodRequestMapper;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    private StudentDonor getDonorByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return studentDonorRepository.findByUser(user)
                .orElseGet(() -> {
                    StudentDonor donor = new StudentDonor();
                    donor.setUser(user);
                    donor.setBloodGroup(com.pranamitra.enums.BloodGroup.B_POSITIVE);
                    donor.setAge(22);
                    donor.setGender("MALE");
                    donor.setWeight(65.0);
                    donor.setCollegeName("JNTUH");
                    donor.setDepartment("Computer Science");
                    donor.setYearOfStudy("4th Year");
                    donor.setStudentId("STD-" + user.getId() + "-" + (System.currentTimeMillis() % 10000));
                    donor.setAddress("Kukatpally");
                    donor.setCity("Hyderabad");
                    donor.setState("Telangana");
                    donor.setPincode("500085");
                    donor.setAvailableToDonate(true);
                    donor.setVerified(true);
                    donor.setActive(true);
                    return studentDonorRepository.save(donor);
                });
    }

    @Override
    public DonorDashboardResponse getDashboardData(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        User user = donor.getUser();

        DonorDashboardResponse stats = new DonorDashboardResponse();
        stats.setFullName(user.getFirstName() + " " + user.getLastName());
        stats.setStudentId(donor.getStudentId());
        stats.setBloodGroup(donor.getBloodGroup());
        stats.setAvailableToDonate(donor.getAvailableToDonate());
        stats.setLastDonationDate(donor.getLastDonationDate());

        LocalDate lastDon = donor.getLastDonationDate();
        if (lastDon != null) {
            stats.setNextEligibleDonationDate(lastDon.plusDays(90));
        } else {
            stats.setNextEligibleDonationDate(LocalDate.now());
        }

        long totalDonations = donationRepository.countByStudentDonorAndStatus(donor, DonationStatus.DONATED);
        long acceptedRequests = donationRepository.countByStudentDonorAndStatus(donor, DonationStatus.SCHEDULED);
        
        // Count active matching requests
        long pendingRequests = getMatchingRequests(userId).size();

        // Count blood requests raised by this donor/user
        java.util.Optional<Patient> patientOpt = patientRepository.findByUser(user);
        long requestsRaised = patientOpt.map(p -> (long) bloodRequestRepository.findByPatient(p).size()).orElse(0L);

        stats.setTotalDonations(totalDonations);
        stats.setAcceptedRequests(acceptedRequests);
        stats.setPendingRequests(pendingRequests);
        stats.setRequestsRaised(requestsRaised);

        return stats;
    }

    @Override
    public StudentDonorResponse getDonorProfile(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        return studentDonorMapper.toResponse(donor);
    }

    @Override
    public StudentDonorResponse updateDonorProfile(Long userId, DonorProfileUpdateRequest request) {
        StudentDonor donor = getDonorByUserId(userId);
        User user = donor.getUser();

        // Update User fields
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        userRepository.save(user);

        // Update StudentDonor fields
        donor.setCollegeName(request.getCollegeName());
        donor.setDepartment(request.getDepartment());
        donor.setStudentId(request.getStudentId());
        donor.setBloodGroup(BloodGroup.valueOf(request.getBloodGroup()));
        donor.setAge(request.getAge());
        donor.setGender(request.getGender());
        donor.setWeight(request.getWeight());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        donor.setPincode(request.getPincode());

        StudentDonor updated = studentDonorRepository.save(donor);
        return studentDonorMapper.toResponse(updated);
    }

    @Override
    public void updatePassword(Long userId, DonorPasswordUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public StudentDonorResponse toggleAvailability(Long userId, boolean available) {
        StudentDonor donor = getDonorByUserId(userId);
        donor.setAvailableToDonate(available);
        StudentDonor updated = studentDonorRepository.save(donor);
        return studentDonorMapper.toResponse(updated);
    }

    @Override
    public List<BloodRequestResponse> getMatchingRequests(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        BloodGroup bloodGroup = donor.getBloodGroup();

        // Fetch all requests matching blood group
        List<BloodRequest> matchedRequests;
        if (bloodGroup != null) {
            matchedRequests = bloodRequestRepository.findByBloodGroup(bloodGroup);
        } else {
            matchedRequests = bloodRequestRepository.findAll();
        }

        // Return approved or pending requests matching blood group, excluding declined or already accepted
        return matchedRequests.stream()
                .filter(req -> req.getRequestStatus() == RequestStatus.PENDING || req.getRequestStatus() == RequestStatus.APPROVED)
                .filter(req -> !declinedRequestRepository.existsByStudentDonorAndBloodRequestId(donor, req.getId()))
                .filter(req -> !donationRepository.findByStudentDonorAndBloodRequest(donor, req).isPresent())
                .map(bloodRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void acceptRequest(Long requestId, Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        BloodRequest req = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("BloodRequest not found with id: " + requestId));

        // Verify not already decided
        if (donationRepository.findByStudentDonorAndBloodRequest(donor, req).isPresent()) {
            throw new IllegalStateException("You have already accepted this blood request.");
        }

        Donation donation = new Donation();
        donation.setStudentDonor(donor);
        donation.setBloodRequest(req);
        donation.setDonationDate(LocalDate.now());
        donation.setStatus(DonationStatus.SCHEDULED);
        Donation saved = donationRepository.save(donation);

        // Notify Patient
        notificationService.createNotification(req.getPatient().getUser(), "Donor Accepted Request", 
            "A student donor (" + donor.getUser().getFirstName() + " " + donor.getUser().getLastName() + ") has accepted your blood request " + req.getRequestNumber() + ".", "SUCCESS");

        // Notify Donor
        notificationService.createNotification(donor.getUser(), "Blood Request Accepted", 
            "You have accepted the blood request " + req.getRequestNumber() + ". Please coordinate coordinate your donation.", "SUCCESS");

        // Notify Admin
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Request Accepted by Donor", 
            "Donor " + donor.getUser().getFirstName() + " " + donor.getUser().getLastName() + " accepted blood request " + req.getRequestNumber() + ".", "INFO");
    }

    @Override
    public void declineRequest(Long requestId, Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        BloodRequest req = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("BloodRequest not found with id: " + requestId));

        if (declinedRequestRepository.existsByStudentDonorAndBloodRequestId(donor, requestId)) {
            throw new IllegalStateException("You have already declined this blood request.");
        }

        DeclinedRequest decline = new DeclinedRequest();
        decline.setStudentDonor(donor);
        decline.setBloodRequest(req);
        declinedRequestRepository.save(decline);
    }

    @Override
    public List<DonationResponse> getAcceptedRequests(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        List<Donation> list = donationRepository.findByStudentDonorAndStatus(donor, DonationStatus.SCHEDULED);

        return list.stream().map(this::mapToDonationResponse).collect(Collectors.toList());
    }

    @Override
    public void completeDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + donationId));

        if (donation.getStatus() != DonationStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled donations can be marked as complete.");
        }

        donation.setStatus(DonationStatus.DONATED);
        donation.setDonationDate(LocalDate.now());
        Donation saved = donationRepository.save(donation);

        // Update donor's last donation date
        StudentDonor donor = donation.getStudentDonor();
        donor.setLastDonationDate(LocalDate.now());
        studentDonorRepository.save(donor);

        // Update blood request status to COMPLETED
        BloodRequest req = saved.getBloodRequest();
        if (req != null) {
            req.setRequestStatus(RequestStatus.COMPLETED);
            bloodRequestRepository.save(req);
        }

        // Notify Patient
        notificationService.createNotification(saved.getBloodRequest().getPatient().getUser(), "Blood Request Completed", 
            "Your blood request " + saved.getBloodRequest().getRequestNumber() + " has been fulfilled. Thank you to our student donor!", "SUCCESS");

        // Notify Donor
        notificationService.createNotification(donor.getUser(), "Donation Complete", 
            "Thank you for donating blood! Your contribution has helped save a life.", "SUCCESS");

        // Notify Admin
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Donation Fulfilled", 
            "Donation is completed for request " + saved.getBloodRequest().getRequestNumber() + " by donor " + donor.getUser().getFirstName() + " " + donor.getUser().getLastName() + ".", "SUCCESS");
    }

    @Override
    public void cancelDonation(Long donationId, Long userId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found with id: " + donationId));

        if (donation.getStatus() != DonationStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled donations can be cancelled.");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        Donation saved = donationRepository.save(donation);
        StudentDonor donor = saved.getStudentDonor();

        // Notify Patient
        notificationService.createNotification(saved.getBloodRequest().getPatient().getUser(), "Donation Cancelled", 
            "The scheduled donor has cancelled their donation for request " + saved.getBloodRequest().getRequestNumber() + ".", "WARNING");

        // Notify Donor
        notificationService.createNotification(donor.getUser(), "Donation Cancelled", 
            "You have cancelled your scheduled donation for request " + saved.getBloodRequest().getRequestNumber() + ".", "INFO");

        // Notify Admin
        notificationService.createNotificationForRole(com.pranamitra.enums.RoleType.ADMIN, "Donation Cancelled by Donor", 
            "Donor " + donor.getUser().getFirstName() + " " + donor.getUser().getLastName() + " has cancelled their donation for request " + saved.getBloodRequest().getRequestNumber() + ".", "WARNING");
    }

    @Override
    public List<DonationResponse> getDonationHistory(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        List<Donation> list = donationRepository.findByStudentDonor(donor).stream()
                .filter(d -> d.getStatus() == DonationStatus.DONATED || d.getStatus() == DonationStatus.CANCELLED)
                .collect(Collectors.toList());

        return list.stream().map(this::mapToDonationResponse).collect(Collectors.toList());
    }

    @Override
    public List<BloodRequestResponse> getMyBloodRequests(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        java.util.Optional<Patient> patientOpt = patientRepository.findByUser(user);
        if (patientOpt.isEmpty()) {
            return new ArrayList<>();
        }
        List<BloodRequest> list = bloodRequestRepository.findByPatient(patientOpt.get());
        return list.stream()
                .sorted(java.util.Comparator.comparing(BloodRequest::getCreatedAt).reversed())
                .map(bloodRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getNotifications(Long userId) {
        StudentDonor donor = getDonorByUserId(userId);
        User user = donor.getUser();
        List<String> notifications = new ArrayList<>();

        // 1. Welcome Msg
        notifications.add("Welcome to PranaMitra, " + user.getFirstName() + "! Thank you for registering as a blood donor.");

        // 2. Eligibility
        LocalDate lastDon = donor.getLastDonationDate();
        if (lastDon != null) {
            LocalDate nextEligible = lastDon.plusDays(90);
            if (LocalDate.now().isBefore(nextEligible)) {
                notifications.add("Donation Eligibility: You are currently not eligible to donate. Next eligible date: " + nextEligible);
            } else {
                notifications.add("Donation Eligibility: You are fully eligible to donate blood! Keep your status available.");
            }
        } else {
            notifications.add("Donation Eligibility: You have not donated yet. You are fully eligible to donate blood!");
        }

        // 3. Pending matching count
        int matchCount = getMatchingRequests(userId).size();
        if (matchCount > 0) {
            notifications.add("Matching Requests Alert: There are " + matchCount + " pending blood requests matching your blood group!");
        }

        // 4. Accepted scheduled count
        long scheduledCount = donationRepository.countByStudentDonorAndStatus(donor, DonationStatus.SCHEDULED);
        if (scheduledCount > 0) {
            notifications.add("Scheduled Donations Reminder: You have " + scheduledCount + " scheduled donation appointment(s) active.");
        }

        return notifications;
    }

    private DonationResponse mapToDonationResponse(Donation donation) {
        BloodRequest req = donation.getBloodRequest();
        Patient p = req.getPatient();
        DonationResponse res = new DonationResponse();
        res.setId(donation.getId());
        res.setDonationDate(donation.getDonationDate());
        res.setStatus(donation.getStatus());
        if (p != null) {
            res.setPatientName(p.getPatientName());
            res.setHospitalName(p.getHospitalName());
            res.setDoctorName(p.getDoctorName());
            res.setHospitalAddress(p.getAddress());
            res.setCity(p.getCity());
            res.setPincode(p.getPincode());
            if (p.getUser() != null) {
                res.setPatientMobile(p.getUser().getMobileNumber());
            }
            res.setAttenderName(p.getAttenderName());
            res.setAttenderMobile(p.getAttenderMobile());
        }
        res.setBloodGroup(req.getBloodGroup());
        res.setUnits(req.getUnitsRequired());
        res.setEmergencyLevel(req.getEmergencyLevel() != null ? req.getEmergencyLevel().name() : "MEDIUM");
        res.setRequiredDate(req.getRequiredDate());
        res.setDistance("3.2 km");
        return res;
    }

    @Override
    public DonorDashboardResponse getLivesImpacted(Long userId) {
        return getDashboardData(userId);
    }
}

