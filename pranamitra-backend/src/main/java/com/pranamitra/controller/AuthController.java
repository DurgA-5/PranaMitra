package com.pranamitra.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.LoginRequest;
import com.pranamitra.dto.response.LoginResponse;
import com.pranamitra.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request));
    }
    @GetMapping("/me")
    public ResponseEntity<String> me() {
        return ResponseEntity.ok("JWT Working");
    }

}