package com.pranamitra.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

public class PatientProfileUpdateRequest {

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    @NotBlank(message = "Attender name is required")
    private String attenderName;

    @NotBlank(message = "Attender mobile is required")
    private String attenderMobile;

    public PatientProfileUpdateRequest() {
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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
}
