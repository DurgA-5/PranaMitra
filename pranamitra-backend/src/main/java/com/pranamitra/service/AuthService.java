package com.pranamitra.service;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}