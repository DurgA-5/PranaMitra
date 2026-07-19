package com.pranamitra.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.BloodRequest;
import com.pranamitra.entity.Patient;
import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.RequestStatus;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    // ==================================================
    // Basic Queries
    // ==================================================

    Optional<BloodRequest> findByRequestNumber(String requestNumber);

    List<BloodRequest> findByPatient(Patient patient);

    List<BloodRequest> findByBloodGroup(BloodGroup bloodGroup);

    List<BloodRequest> findByRequestStatus(RequestStatus requestStatus);

    @Query("SELECT b.id FROM BloodRequest b WHERE b.requestNumber = :requestNumber")
	boolean existsByRequestNumber(String requestNumber);

    // ==================================================
    // Reports & Analytics
    // ==================================================

    @Query("""
            SELECT b.requestStatus, COUNT(b)
            FROM BloodRequest b
            GROUP BY b.requestStatus
            """)
    List<Object[]> getRequestStatusStatistics();

    @Query("""
            SELECT b.emergencyLevel, COUNT(b)
            FROM BloodRequest b
            GROUP BY b.emergencyLevel
            """)
    List<Object[]> getEmergencyLevelStatistics();

}