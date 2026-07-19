package com.pranamitra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.DeclinedRequest;
import com.pranamitra.entity.StudentDonor;

@Repository
public interface DeclinedRequestRepository extends JpaRepository<DeclinedRequest, Long> {

    List<DeclinedRequest> findByStudentDonor(StudentDonor studentDonor);

    boolean existsByStudentDonorAndBloodRequestId(StudentDonor studentDonor, Long bloodRequestId);
}
