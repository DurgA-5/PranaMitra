package com.pranamitra.dto.response.report;

public class CityReportResponse {

    private String city;
    private Long totalDonors;

    public CityReportResponse() {
    }

    public CityReportResponse(String city, Long totalDonors) {
        this.city = city;
        this.totalDonors = totalDonors;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Long getTotalDonors() {
        return totalDonors;
    }

    public void setTotalDonors(Long totalDonors) {
        this.totalDonors = totalDonors;
    }
}