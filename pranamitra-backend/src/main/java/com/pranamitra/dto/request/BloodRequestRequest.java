package com.pranamitra.dto.request;

import java.time.LocalDate;

import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.EmergencyLevel;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BloodRequestRequest {

    private Long patientId;

    @NotNull(message = "Blood Group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units Required is mandatory")
    @Min(value = 1, message = "Minimum 1 unit is required")
    private Integer unitsRequired;

    @NotNull(message = "Emergency Level is required")
    private EmergencyLevel emergencyLevel;

    @NotNull(message = "Required Date is mandatory")
    @FutureOrPresent(message = "Required Date cannot be in the past")
    private LocalDate requiredDate;

    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;

    public BloodRequestRequest() {
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getUnitsRequired() {
        return unitsRequired;
    }

    public void setUnitsRequired(Integer unitsRequired) {
        this.unitsRequired = unitsRequired;
    }

    public EmergencyLevel getEmergencyLevel() {
        return emergencyLevel;
    }

    public void setEmergencyLevel(EmergencyLevel emergencyLevel) {
        this.emergencyLevel = emergencyLevel;
    }

    public LocalDate getRequiredDate() {
        return requiredDate;
    }

    public void setRequiredDate(LocalDate requiredDate) {
        this.requiredDate = requiredDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}