package com.pranamitra.dto.response.report;

import com.pranamitra.enums.BloodGroup;

public class BloodGroupReportResponse {

    private BloodGroup bloodGroup;
    private Long totalDonors;

    public BloodGroupReportResponse() {
    }

    public BloodGroupReportResponse(BloodGroup bloodGroup, Long totalDonors) {
        this.bloodGroup = bloodGroup;
        this.totalDonors = totalDonors;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Long getTotalDonors() {
        return totalDonors;
    }

    public void setTotalDonors(Long totalDonors) {
        this.totalDonors = totalDonors;
    }
}