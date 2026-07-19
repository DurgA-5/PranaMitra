package com.pranamitra.dto.request;

import jakarta.validation.constraints.*;

public class DonorCompleteProfileRequest {

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18 years")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Weight is required")
    @Min(value = 45, message = "Weight must be at least 45 kg")
    private Double weight;

    @NotBlank(message = "College is required")
    private String collegeName;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Year of study is required")
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
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be exactly 6 digits")
    private String pincode;

    private Boolean availableToDonate = true;

    public DonorCompleteProfileRequest() {
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
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

    public Boolean getAvailableToDonate() {
        return availableToDonate;
    }

    public void setAvailableToDonate(Boolean availableToDonate) {
        this.availableToDonate = availableToDonate;
    }
}
