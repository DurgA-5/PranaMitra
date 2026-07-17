package com.pranamitra.dto.response.report;

import com.pranamitra.enums.EmergencyLevel;

public class EmergencyLevelReportResponse {

    private EmergencyLevel emergencyLevel;
    private Long totalRequests;

    public EmergencyLevelReportResponse() {
    }

    public EmergencyLevelReportResponse(EmergencyLevel emergencyLevel, Long totalRequests) {
        this.emergencyLevel = emergencyLevel;
        this.totalRequests = totalRequests;
    }

    public EmergencyLevel getEmergencyLevel() {
        return emergencyLevel;
    }

    public void setEmergencyLevel(EmergencyLevel emergencyLevel) {
        this.emergencyLevel = emergencyLevel;
    }

    public Long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(Long totalRequests) {
        this.totalRequests = totalRequests;
    }
}