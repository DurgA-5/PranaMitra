package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.DonorPasswordUpdateRequest;
import com.pranamitra.dto.request.DonorProfileUpdateRequest;
import com.pranamitra.dto.response.DonationResponse;
import com.pranamitra.dto.response.DonorDashboardResponse;
import com.pranamitra.dto.response.StudentDonorResponse;
import com.pranamitra.dto.response.BloodRequestResponse;

public interface DonorPortalService {

    DonorDashboardResponse getDashboardData(Long userId);

    StudentDonorResponse getDonorProfile(Long userId);

    StudentDonorResponse updateDonorProfile(Long userId, DonorProfileUpdateRequest request);

    void updatePassword(Long userId, DonorPasswordUpdateRequest request);

    StudentDonorResponse toggleAvailability(Long userId, boolean available);

    List<BloodRequestResponse> getMatchingRequests(Long userId);

    void acceptRequest(Long requestId, Long userId);

    void declineRequest(Long requestId, Long userId);

    List<DonationResponse> getAcceptedRequests(Long userId);

    void completeDonation(Long donationId, Long userId);

    void cancelDonation(Long donationId, Long userId);

    List<DonationResponse> getDonationHistory(Long userId);

    List<String> getNotifications(Long userId);
}
