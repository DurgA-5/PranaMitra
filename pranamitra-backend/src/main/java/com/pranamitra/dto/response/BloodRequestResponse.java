package com.pranamitra.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.EmergencyLevel;
import com.pranamitra.enums.RequestStatus;

public class BloodRequestResponse {

    private Long id;

    private String requestNumber;

    private Long patientId;

    private String patientName;

    private BloodGroup bloodGroup;

    private Integer unitsRequired;

    private EmergencyLevel emergencyLevel;

    private RequestStatus requestStatus;

    private LocalDate requiredDate;

    private String remarks;

    private String hospitalName;
    private String doctorName;
    private String hospitalAddress;
    private String city;
    private String state;
    private String pincode;
    private String patientMobile;
    private String attenderName;
    private String attenderMobile;
    private String distance;
    private java.util.List<java.util.Map<String, Object>> assignedDonors;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BloodRequestResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRequestNumber() {
        return requestNumber;
    }

    public void setRequestNumber(String requestNumber) {
        this.requestNumber = requestNumber;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
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

    public RequestStatus getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
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

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getPatientMobile() {
        return patientMobile;
    }

    public void setPatientMobile(String patientMobile) {
        this.patientMobile = patientMobile;
    }

    public String getAttenderName() {
        return attenderName;
    }

    public void setAttenderName(String attenderName) {
        this.attenderName = attenderName;
    }

    public String getAttenderMobile() {
        return attenderMobile;
    }

    public void setAttenderMobile(String attenderMobile) {
        this.attenderMobile = attenderMobile;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public java.util.List<java.util.Map<String, Object>> getAssignedDonors() {
        return assignedDonors;
    }

    public void setAssignedDonors(java.util.List<java.util.Map<String, Object>> assignedDonors) {
        this.assignedDonors = assignedDonors;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}