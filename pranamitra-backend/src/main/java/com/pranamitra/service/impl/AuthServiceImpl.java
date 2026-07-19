package com.pranamitra.service.impl;

import java.time.LocalDate;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.request.DonorCompleteProfileRequest;
import com.pranamitra.dto.request.PatientCompleteProfileRequest;
import com.pranamitra.dto.request.ForgotPasswordRequest;
import com.pranamitra.dto.request.ResetPasswordRequest;
import com.pranamitra.dto.response.LoginResponse;
import com.pranamitra.dto.response.ProfileStatusResponse;
import com.pranamitra.entity.*;
import com.pranamitra.enums.*;
import com.pranamitra.repository.*;
import com.pranamitra.security.JwtService;
import com.pranamitra.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentDonorRepository studentDonorRepository;
    private final PatientRepository patientRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final com.pranamitra.service.NotificationService notificationService;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            StudentDonorRepository studentDonorRepository,
            PatientRepository patientRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            com.pranamitra.service.NotificationService notificationService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentDonorRepository = studentDonorRepository;
        this.patientRepository = patientRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password."));

        if (!user.getActive()) {
            throw new RuntimeException("User account is inactive.");
        }

        if (!user.getVerified()) {
            throw new RuntimeException("User account is not verified.");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setFullName(
                user.getFirstName() + " " + user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName().name());

        return response;
    }

    @Override
    public ProfileStatusResponse checkProfileStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        String role = user.getRole().getRoleName().name();
        boolean exists = false;

        if (user.getRole().getRoleName() == RoleType.DONOR) {
            exists = studentDonorRepository.findByUser(user).isPresent();
        } else if (user.getRole().getRoleName() == RoleType.PATIENT) {
            exists = patientRepository.findByUser(user).isPresent();
        } else {
            exists = true; // Admin or other roles default to complete
        }

        return new ProfileStatusResponse(exists, role);
    }

    @Override
    public void completeDonorProfile(Long userId, DonorCompleteProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getRole().getRoleName() != RoleType.DONOR) {
            throw new IllegalArgumentException("User role is not DONOR.");
        }

        if (studentDonorRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("Donor profile already exists.");
        }

        StudentDonor donor = new StudentDonor();
        donor.setUser(user);
        donor.setBloodGroup(BloodGroup.valueOf(request.getBloodGroup()));
        donor.setAge(request.getAge());
        donor.setGender(request.getGender());
        donor.setWeight(request.getWeight());
        donor.setCollegeName(request.getCollegeName());
        donor.setDepartment(request.getDepartment());
        donor.setYearOfStudy(request.getYearOfStudy());
        donor.setStudentId(request.getStudentId());
        donor.setAddress(request.getAddress());
        donor.setCity(request.getCity());
        donor.setState(request.getState());
        donor.setPincode(request.getPincode());
        donor.setAvailableToDonate(request.getAvailableToDonate() != null ? request.getAvailableToDonate() : true);
        donor.setVerified(true);
        donor.setActive(true);

        studentDonorRepository.save(donor);

        notificationService.createNotificationForRole(RoleType.ADMIN, "New Student Donor Registered", 
            "A new student donor profile for " + user.getFirstName() + " " + user.getLastName() + " (" + donor.getBloodGroup() + ") has been completed.", "INFO");

        notificationService.createNotification(user, "Welcome to PranaMitra", 
            "Your student donor profile has been completed and activated. Thank you for registering!", "SUCCESS");
    }

    @Override
    public void completePatientProfile(Long userId, PatientCompleteProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (user.getRole().getRoleName() != RoleType.PATIENT) {
            throw new IllegalArgumentException("User role is not PATIENT.");
        }

        if (patientRepository.findByUser(user).isPresent()) {
            throw new IllegalStateException("Patient profile already exists.");
        }

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setPatientName(user.getFirstName() + " " + user.getLastName());
        patient.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        patient.setAge(request.getAge());
        patient.setBloodGroup(BloodGroup.valueOf(request.getBloodGroup()));
        patient.setUnitsRequired(1);
        patient.setHospitalName(request.getHospitalName());
        patient.setDoctorName(request.getDoctorName());
        patient.setAttenderName(request.getAttenderName());
        patient.setAttenderMobile(request.getAttenderMobile());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPincode(request.getPincode());
        patient.setRequiredDate(LocalDate.now().plusDays(1));
        patient.setEmergencyLevel(EmergencyLevel.MEDIUM);
        patient.setRequestStatus(RequestStatus.PENDING);

        patientRepository.save(patient);

        notificationService.createNotificationForRole(RoleType.ADMIN, "New Patient Registered", 
            "A new patient profile for " + user.getFirstName() + " " + user.getLastName() + " has been registered.", "INFO");

        notificationService.createNotification(user, "Welcome to PranaMitra", 
            "Your patient profile has been successfully completed.", "SUCCESS");
    }

    @Override
    public String initiateForgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found."));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        return token;
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match.");
        }

        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token."));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired.");
        }

        // Update password using BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Invalidate token
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        
        userRepository.save(user);
    }
}