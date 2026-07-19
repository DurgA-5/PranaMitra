package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.entity.User;
import com.pranamitra.mapper.StudentDonorMapper;
import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.repository.RoleRepository;
import com.pranamitra.service.StudentDonorService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.pranamitra.entity.Role;

@Service
public class StudentDonorServiceImpl implements StudentDonorService {

    private final StudentDonorRepository donorRepository;
    private final UserRepository userRepository;
    private final StudentDonorMapper donorMapper;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentDonorServiceImpl(StudentDonorRepository donorRepository,
                                   UserRepository userRepository,
                                   StudentDonorMapper donorMapper,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.donorMapper = donorMapper;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public StudentDonorResponse registerDonor(StudentDonorRequest request) {

        // Validate duplicates
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already exists.");
        }
        if (donorRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        // Split fullName into firstName and lastName
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String firstName = "";
        String lastName = "";
        int spaceIndex = fullName.indexOf(' ');
        if (spaceIndex != -1) {
            firstName = fullName.substring(0, spaceIndex).trim();
            lastName = fullName.substring(spaceIndex + 1).trim();
        } else {
            firstName = fullName;
            lastName = "";
        }

        // Create new User record
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setPassword(passwordEncoder.encode("Donor@123")); // Default password
        user.setVerified(true);
        user.setActive(true);

        Role role = roleRepository.findByRoleName(com.pranamitra.enums.RoleType.DONOR)
                .orElseThrow(() -> new RuntimeException("Donor role not found"));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        StudentDonor donor = donorMapper.toEntity(request, savedUser);

        StudentDonor savedDonor = donorRepository.save(donor);

        return donorMapper.toResponse(savedDonor);
    }

    @Override
    public StudentDonorResponse getDonorById(Long id) {

        StudentDonor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        return donorMapper.toResponse(donor);
    }

    @Override
    public List<StudentDonorResponse> getAllDonors() {

        List<StudentDonorResponse> responseList = new ArrayList<>();

        for (StudentDonor donor : donorRepository.findAll()) {
            responseList.add(donorMapper.toResponse(donor));
        }

        return responseList;
    }

    @Override
    public StudentDonorResponse updateDonor(Long id, StudentDonorRequest request) {

        StudentDonor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donor.setBloodGroup(request.getBloodGroup());
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
        donor.setLastDonationDate(request.getLastDonationDate());
        donor.setAvailableToDonate(request.getAvailableToDonate());

        StudentDonor updated = donorRepository.save(donor);

        return donorMapper.toResponse(updated);
    }

    @Override
    public void deleteDonor(Long id) {

        StudentDonor donor = donorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        donorRepository.delete(donor);
    }
}