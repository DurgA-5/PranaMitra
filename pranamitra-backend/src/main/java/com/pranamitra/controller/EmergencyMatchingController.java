package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.response.MatchingDonorResponse;
import com.pranamitra.service.EmergencyMatchingService;

@RestController
@RequestMapping("/api/matching")
public class EmergencyMatchingController {

    private final EmergencyMatchingService emergencyMatchingService;

    public EmergencyMatchingController(EmergencyMatchingService emergencyMatchingService) {
        this.emergencyMatchingService = emergencyMatchingService;
    }

    @GetMapping("/request/{bloodRequestId}")
    public ResponseEntity<List<MatchingDonorResponse>> getMatchingDonors(
            @PathVariable Long bloodRequestId) {

        return ResponseEntity.ok(
                emergencyMatchingService.findMatchingDonors(bloodRequestId));
    }
}