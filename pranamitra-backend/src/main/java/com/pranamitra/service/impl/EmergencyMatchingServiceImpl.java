package com.pranamitra.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pranamitra.dto.response.MatchingDonorResponse;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.repository.BloodRequestRepository;
import com.pranamitra.repository.StudentDonorRepository;
import com.pranamitra.service.EmergencyMatchingService;

@Service
public class EmergencyMatchingServiceImpl implements EmergencyMatchingService {

    private final BloodRequestRepository bloodRequestRepository;
    private final StudentDonorRepository studentDonorRepository;

    public EmergencyMatchingServiceImpl(
            BloodRequestRepository bloodRequestRepository,
            StudentDonorRepository studentDonorRepository) {

        this.bloodRequestRepository = bloodRequestRepository;
        this.studentDonorRepository = studentDonorRepository;
    }

    @Override
    public List<MatchingDonorResponse> findMatchingDonors(Long bloodRequestId) {

        BloodRequest bloodRequest = bloodRequestRepository.findById(bloodRequestId)
                .orElseThrow(() -> new RuntimeException("Blood Request not found."));

        List<StudentDonor> donors =
                studentDonorRepository
                        .findByBloodGroupAndCityIgnoreCaseAndVerifiedTrueAndActiveTrueAndAvailableToDonateTrue(
                                bloodRequest.getBloodGroup(),
                                bloodRequest.getPatient().getCity());

        List<MatchingDonorResponse> responseList = new ArrayList<>();

        for (StudentDonor donor : donors) {

            MatchingDonorResponse response = new MatchingDonorResponse();

            response.setStudentId(donor.getId());

            response.setStudentName(
                    donor.getUser().getFirstName() + " "
                  + donor.getUser().getLastName());

            response.setBloodGroup(donor.getBloodGroup());

            response.setMobileNumber(
                    donor.getUser().getMobileNumber());

            response.setCity(donor.getCity());

            response.setCollegeName(donor.getCollegeName());

            response.setDepartment(donor.getDepartment());

            response.setYear(
                    (donor.getYearOfStudy()));

            responseList.add(response);
        }

        return responseList;
    }
}