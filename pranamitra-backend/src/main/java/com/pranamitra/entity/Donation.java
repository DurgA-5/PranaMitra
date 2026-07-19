package com.pranamitra.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pranamitra.enums.DonationStatus;

import jakarta.persistence.*;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private StudentDonor studentDonor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest bloodRequest;

    @Column(nullable = false)
    private LocalDate donationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Donation() {
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (donationDate == null) {
            donationDate = LocalDate.now();
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentDonor getStudentDonor() {
        return studentDonor;
    }

    public void setStudentDonor(StudentDonor studentDonor) {
        this.studentDonor = studentDonor;
    }

    public BloodRequest getBloodRequest() {
        return bloodRequest;
    }

    public void setBloodRequest(BloodRequest bloodRequest) {
        this.bloodRequest = bloodRequest;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }

    public DonationStatus getStatus() {
        return status;
    }

    public void setStatus(DonationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
