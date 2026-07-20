package com.pranamitra.dto.response;

import java.time.LocalDate;

import com.pranamitra.enums.BloodGroup;

public class DonorDashboardResponse {

    private String fullName;
    private String studentId;
    private BloodGroup bloodGroup;
    private Boolean availableToDonate;
    private LocalDate lastDonationDate;
    private LocalDate nextEligibleDonationDate;
    private Long totalDonations;
    private Long acceptedRequests;
    private Long pendingRequests;
    private Long requestsRaised;

    public DonorDashboardResponse() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Boolean getAvailableToDonate() {
        return availableToDonate;
    }

    public void setAvailableToDonate(Boolean availableToDonate) {
        this.availableToDonate = availableToDonate;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public LocalDate getNextEligibleDonationDate() {
        return nextEligibleDonationDate;
    }

    public void setNextEligibleDonationDate(LocalDate nextEligibleDonationDate) {
        this.nextEligibleDonationDate = nextEligibleDonationDate;
    }

    public Long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(Long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public Long getAcceptedRequests() {
        return acceptedRequests;
    }

    public void setAcceptedRequests(Long acceptedRequests) {
        this.acceptedRequests = acceptedRequests;
    }

    public Long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(Long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public Long getRequestsRaised() {
        return requestsRaised;
    }

    public void setRequestsRaised(Long requestsRaised) {
        this.requestsRaised = requestsRaised;
    }
}
