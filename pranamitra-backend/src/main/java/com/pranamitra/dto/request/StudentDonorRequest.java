package com.pranamitra.dto.request;

import java.time.LocalDate;

import com.pranamitra.enums.BloodGroup;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class StudentDonorRequest {

    private Long userId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone Number must be exactly 10 digits")
    private String mobileNumber;

    @NotNull(message = "Blood Group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Age is required")
    @Min(18)
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotBlank(message = "College Name is required")
    private String collegeName;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Year of Study is required")
    private String yearOfStudy;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private LocalDate lastDonationDate;

    @NotNull(message = "Availability is required")
    private Boolean availableToDonate;

    // GETTER & SETTER FOR userId

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(String yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
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

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public Boolean getAvailableToDonate() {
        return availableToDonate;
    }

    public void setAvailableToDonate(Boolean availableToDonate) {
        this.availableToDonate = availableToDonate;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }
}