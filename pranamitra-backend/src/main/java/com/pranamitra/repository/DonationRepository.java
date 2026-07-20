package com.pranamitra.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.Donation;
import com.pranamitra.entity.StudentDonor;
import com.pranamitra.entity.BloodRequest;
import com.pranamitra.enums.DonationStatus;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStudentDonor(StudentDonor studentDonor);

    List<Donation> findByStudentDonorAndStatus(StudentDonor studentDonor, DonationStatus status);

    long countByStudentDonor(StudentDonor studentDonor);

    long countByStudentDonorAndStatus(StudentDonor studentDonor, DonationStatus status);

    Optional<Donation> findByStudentDonorAndBloodRequest(StudentDonor studentDonor, BloodRequest bloodRequest);

    List<Donation> findByBloodRequest(BloodRequest bloodRequest);
}
