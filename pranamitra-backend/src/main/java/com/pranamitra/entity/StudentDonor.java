package com.pranamitra.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pranamitra.enums.BloodGroup;

import jakarta.persistence.*;

@Entity
@Table(name = "student_donor")
public class StudentDonor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private String collegeName;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String yearOfStudy;

    @Column(nullable = false, unique = true)
    private String studentId;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    private LocalDate lastDonationDate;

    @Column(nullable = false)
    private Boolean availableToDonate = true;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public StudentDonor() {
    }

    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (availableToDonate == null) {
            availableToDonate = true;
        }

        if (verified == null) {
            verified = false;
        }

        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ===========================
    // Getters
    // ===========================

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public Integer getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public Double getWeight() {
        return weight;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public String getDepartment() {
        return department;
    }

    public String getYearOfStudy() {
        return yearOfStudy;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getPincode() {
        return pincode;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public Boolean getAvailableToDonate() {
        return availableToDonate;
    }

    public Boolean getVerified() {
        return verified;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // ===========================
    // Setters
    // ===========================

    public void setUser(User user) {
        this.user = user;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setYearOfStudy(String yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public void setAvailableToDonate(Boolean availableToDonate) {
        this.availableToDonate = availableToDonate;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}