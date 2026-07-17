package com.pranamitra.dto.response.report;

import com.pranamitra.enums.RequestStatus;

public class RequestStatusReportResponse {

    private RequestStatus requestStatus;
    private Long totalRequests;

    public RequestStatusReportResponse() {
    }

    public RequestStatusReportResponse(RequestStatus requestStatus, Long totalRequests) {
        this.requestStatus = requestStatus;
        this.totalRequests = totalRequests;
    }

    public RequestStatus getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(RequestStatus requestStatus) {
        this.requestStatus = requestStatus;
    }

    public Long getTotalRequests() {
        return totalRequests;
    }

    public void setTotalRequests(Long totalRequests) {
        this.totalRequests = totalRequests;
    }
}