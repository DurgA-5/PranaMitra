package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.response.MatchingDonorResponse;

public interface EmergencyMatchingService {

    List<MatchingDonorResponse> findMatchingDonors(Long bloodRequestId);

}