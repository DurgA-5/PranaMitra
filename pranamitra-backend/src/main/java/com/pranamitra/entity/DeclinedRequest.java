package com.pranamitra.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "declined_requests", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"donor_id", "request_id"})
})
public class DeclinedRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private StudentDonor studentDonor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest bloodRequest;

    private LocalDateTime declinedAt;

    public DeclinedRequest() {
    }

    @PrePersist
    public void onCreate() {
        declinedAt = LocalDateTime.now();
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

    public LocalDateTime getDeclinedAt() {
        return declinedAt;
    }

    public void setDeclinedAt(LocalDateTime declinedAt) {
        this.declinedAt = declinedAt;
    }
}
