package com.pranamitra.dto.response;

import com.pranamitra.enums.BloodGroup;

import java.time.LocalDate;

public class PatientDashboardResponse {

    private String fullName;
    private BloodGroup bloodGroup;
    private String hospitalName;
    private String doctorName;
    private String city;
    private long totalRequests;
    private long pendingRequests;
    private long activeRequests;
    private long completedRequests;
    private long cancelledRequests;
    private long emergencyRequests;
    private LocalDate lastRequestDate;

    public PatientDashboardResponse() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
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

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(long totalRequests) {
        this.totalRequests = totalRequests;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getActiveRequests() {
        return activeRequests;
    }

    public void setActiveRequests(long activeRequests) {
        this.activeRequests = activeRequests;
    }

    public long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public long getCancelledRequests() {
        return cancelledRequests;
    }

    public void setCancelledRequests(long cancelledRequests) {
        this.cancelledRequests = cancelledRequests;
    }

    public long getEmergencyRequests() {
        return emergencyRequests;
    }

    public void setEmergencyRequests(long emergencyRequests) {
        this.emergencyRequests = emergencyRequests;
    }

    public LocalDate getLastRequestDate() {
        return lastRequestDate;
    }

    public void setLastRequestDate(LocalDate lastRequestDate) {
        this.lastRequestDate = lastRequestDate;
    }
}
