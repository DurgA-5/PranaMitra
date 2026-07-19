package com.pranamitra.service;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.request.DonorCompleteProfileRequest;
import com.pranamitra.dto.request.PatientCompleteProfileRequest;
import com.pranamitra.dto.request.ForgotPasswordRequest;
import com.pranamitra.dto.request.ResetPasswordRequest;
import com.pranamitra.dto.response.LoginResponse;
import com.pranamitra.dto.response.ProfileStatusResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    ProfileStatusResponse checkProfileStatus(Long userId);

    void completeDonorProfile(Long userId, DonorCompleteProfileRequest request);

    void completePatientProfile(Long userId, PatientCompleteProfileRequest request);

    String initiateForgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}