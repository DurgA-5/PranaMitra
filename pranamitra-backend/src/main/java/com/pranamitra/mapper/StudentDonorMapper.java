package com.pranamitra.mapper;

import org.springframework.stereotype.Component;

import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.entity.User;

@Component
public class StudentDonorMapper {

    public StudentDonor toEntity(StudentDonorRequest request, User user) {

        StudentDonor donor = new StudentDonor();

        donor.setUser(user);
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

        donor.setAvailableToDonate(
                request.getAvailableToDonate() != null
                        ? request.getAvailableToDonate()
                        : true);

        return donor;
    }

    public StudentDonorResponse toResponse(StudentDonor donor) {

        StudentDonorResponse response = new StudentDonorResponse();

        User user = donor.getUser();

        response.setId(donor.getId());

        if (user != null) {
            response.setUserId(user.getId());

            String firstName = user.getFirstName() != null ? user.getFirstName() : "";
            String lastName = user.getLastName() != null ? user.getLastName() : "";

            response.setFullName((firstName + " " + lastName).trim());

            response.setEmail(user.getEmail());
            response.setMobileNumber(user.getMobileNumber());
        }

        response.setBloodGroup(donor.getBloodGroup());
        response.setAge(donor.getAge());
        response.setGender(donor.getGender());
        response.setWeight(donor.getWeight());
        response.setCollegeName(donor.getCollegeName());
        response.setDepartment(donor.getDepartment());
        response.setYearOfStudy(donor.getYearOfStudy());
        response.setStudentId(donor.getStudentId());
        response.setAddress(donor.getAddress());
        response.setCity(donor.getCity());
        response.setState(donor.getState());
        response.setPincode(donor.getPincode());
        response.setLastDonationDate(donor.getLastDonationDate());
        response.setAvailableToDonate(donor.getAvailableToDonate());
        response.setVerified(donor.getVerified());
        response.setActive(donor.getActive());
        response.setCreatedAt(donor.getCreatedAt());

        return response;
    }
}
