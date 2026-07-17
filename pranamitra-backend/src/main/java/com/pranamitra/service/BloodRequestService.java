package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.response.BloodRequestResponse;

public interface BloodRequestService {

    // Create a new blood request
    BloodRequestResponse createBloodRequest(BloodRequestRequest request);

    // Get blood request by ID
    BloodRequestResponse getBloodRequestById(Long id);

    // Get all blood requests
    List<BloodRequestResponse> getAllBloodRequests();

    // Update blood request
    BloodRequestResponse updateBloodRequest(Long id, BloodRequestRequest request);

    // Delete blood request
    void deleteBloodRequest(Long id);

}