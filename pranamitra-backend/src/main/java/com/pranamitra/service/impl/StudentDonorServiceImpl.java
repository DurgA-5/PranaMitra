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
import com.pranamitra.service.StudentDonorService;

@Service
public class StudentDonorServiceImpl implements StudentDonorService {

    private final StudentDonorRepository donorRepository;
    private final UserRepository userRepository;
    private final StudentDonorMapper donorMapper;

    public StudentDonorServiceImpl(StudentDonorRepository donorRepository,
                                   UserRepository userRepository,
                                   StudentDonorMapper donorMapper) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
        this.donorMapper = donorMapper;
    }

    @Override
    public StudentDonorResponse registerDonor(StudentDonorRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (donorRepository.existsByStudentId(request.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        StudentDonor donor = donorMapper.toEntity(request, user);

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