package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.StudentDonorRequest;
import com.pranamitra.dto.response.StudentDonorResponse;

public interface StudentDonorService {

    StudentDonorResponse registerDonor(StudentDonorRequest request);

    StudentDonorResponse getDonorById(Long id);

    List<StudentDonorResponse> getAllDonors();

    StudentDonorResponse updateDonor(Long id, StudentDonorRequest request);

    void deleteDonor(Long id);

}