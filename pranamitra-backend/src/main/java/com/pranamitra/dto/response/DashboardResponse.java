package com.pranamitra.dto.response;

public class DashboardResponse {

    private Long totalUsers;
    private Long totalStudentDonors;
    private Long verifiedDonors;
    private Long availableDonors;
    private Long totalPatients;
    private Long totalBloodRequests;
    private Long pendingRequests;
    private Long completedRequests;
    private Long totalBloodBanks;
    private Long emergencyRequests;
    private Long newContactQueries;

    public DashboardResponse() {
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalStudentDonors() {
        return totalStudentDonors;
    }

    public void setTotalStudentDonors(Long totalStudentDonors) {
        this.totalStudentDonors = totalStudentDonors;
    }

    public Long getVerifiedDonors() {
        return verifiedDonors;
    }

    public void setVerifiedDonors(Long verifiedDonors) {
        this.verifiedDonors = verifiedDonors;
    }

    public Long getAvailableDonors() {
        return availableDonors;
    }

    public void setAvailableDonors(Long availableDonors) {
        this.availableDonors = availableDonors;
    }

    public Long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public Long getTotalBloodRequests() {
        return totalBloodRequests;
    }

    public void setTotalBloodRequests(Long totalBloodRequests) {
        this.totalBloodRequests = totalBloodRequests;
    }

    public Long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(Long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public Long getCompletedRequests() {
        return completedRequests;
    }

    public void setCompletedRequests(Long completedRequests) {
        this.completedRequests = completedRequests;
    }

    public Long getTotalBloodBanks() {
        return totalBloodBanks;
    }

    public void setTotalBloodBanks(Long totalBloodBanks) {
        this.totalBloodBanks = totalBloodBanks;
    }

    public Long getEmergencyRequests() {
        return emergencyRequests;
    }

    public void setEmergencyRequests(Long emergencyRequests) {
        this.emergencyRequests = emergencyRequests;
    }

    public Long getNewContactQueries() {
        return newContactQueries;
    }

    public void setNewContactQueries(Long newContactQueries) {
        this.newContactQueries = newContactQueries;
    }
}