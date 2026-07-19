package com.pranamitra.service;

import java.util.List;

import com.pranamitra.dto.request.PatientPasswordUpdateRequest;
import com.pranamitra.dto.request.PatientProfileUpdateRequest;
import com.pranamitra.dto.request.BloodRequestRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.dto.response.BloodRequestResponse;
import com.pranamitra.dto.response.PatientDashboardResponse;
import com.pranamitra.dto.response.PatientResponse;

public interface PatientPortalService {

    PatientDashboardResponse getDashboardData(Long userId);

    PatientResponse getProfile(Long userId);

    PatientResponse updateProfile(Long userId, PatientProfileUpdateRequest request);

    void updatePassword(Long userId, PatientPasswordUpdateRequest request);

    BloodRequestResponse createBloodRequest(Long userId, BloodRequestRequest request);

    List<BloodRequestResponse> getMyBloodRequests(Long userId);

    BloodRequestResponse getBloodRequestById(Long userId, Long requestId);

    void cancelBloodRequest(Long userId, Long requestId);

    List<BloodBankResponse> getAllBloodBanks();

    List<BloodBankResponse> getBloodBanksByCity(String city);

    List<String> getNotifications(Long userId);
}
