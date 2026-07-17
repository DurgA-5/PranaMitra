package com.pranamitra.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.pranamitra.dto.request.BloodBankRequest;
import com.pranamitra.dto.response.BloodBankResponse;
import com.pranamitra.service.BloodBankService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blood-banks")
@Validated
public class BloodBankController {

    private final BloodBankService bloodBankService;

    public BloodBankController(BloodBankService bloodBankService) {
        this.bloodBankService = bloodBankService;
    }

    @PostMapping
    public ResponseEntity<BloodBankResponse> registerBloodBank(
            @Valid @RequestBody BloodBankRequest request) {

        return new ResponseEntity<>(
                bloodBankService.registerBloodBank(request),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BloodBankResponse>> getAllBloodBanks() {

        return ResponseEntity.ok(bloodBankService.getAllBloodBanks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodBankResponse> getBloodBankById(
            @PathVariable Long id) {

        return ResponseEntity.ok(bloodBankService.getBloodBankById(id));
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<BloodBankResponse>> getBloodBanksByCity(
            @PathVariable String city) {

        return ResponseEntity.ok(bloodBankService.getBloodBanksByCity(city));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodBankResponse> updateBloodBank(
            @PathVariable Long id,
            @Valid @RequestBody BloodBankRequest request) {

        return ResponseEntity.ok(
                bloodBankService.updateBloodBank(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBloodBank(
            @PathVariable Long id) {

        bloodBankService.deleteBloodBank(id);

        return ResponseEntity.ok("Blood Bank deleted successfully.");
    }
}