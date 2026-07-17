package com.pranamitra.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.response.LoginResponse;
import com.pranamitra.entity.User;
import com.pranamitra.repository.UserRepository;
import com.pranamitra.security.JwtService;
import com.pranamitra.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password."));

        if (!user.getActive()) {
            throw new RuntimeException("User account is inactive.");
        }

        if (!user.getVerified()) {
            throw new RuntimeException("User account is not verified.");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();

        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setFullName(
                user.getFirstName() + " " + user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getRoleName().name());

        return response;
    }

}