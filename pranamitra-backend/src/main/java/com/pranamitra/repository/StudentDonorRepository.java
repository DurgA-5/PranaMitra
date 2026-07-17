package com.pranamitra.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.StudentDonor;
import com.pranamitra.entity.User;
import com.pranamitra.enums.BloodGroup;

@Repository
public interface StudentDonorRepository extends JpaRepository<StudentDonor, Long> {

    // ==================================================
    // Basic Queries
    // ==================================================

    Optional<StudentDonor> findByUser(User user);

    boolean existsByStudentId(String studentId);

    List<StudentDonor> findByBloodGroup(BloodGroup bloodGroup);

    List<StudentDonor> findByCityIgnoreCase(String city);

    List<StudentDonor> findByBloodGroupAndCityIgnoreCase(
            BloodGroup bloodGroup,
            String city);

    List<StudentDonor> findByVerifiedTrue();

    List<StudentDonor> findByActiveTrue();

    List<StudentDonor> findByAvailableToDonateTrue();

    List<StudentDonor> findByBloodGroupAndCityIgnoreCaseAndVerifiedTrueAndActiveTrueAndAvailableToDonateTrue(
            BloodGroup bloodGroup,
            String city);

    // ==================================================
    // Reports & Analytics
    // ==================================================

    @Query("""
            SELECT s.bloodGroup, COUNT(s)
            FROM StudentDonor s
            GROUP BY s.bloodGroup
            """)
    List<Object[]> getBloodGroupStatistics();

    @Query("""
            SELECT s.city, COUNT(s)
            FROM StudentDonor s
            GROUP BY s.city
            ORDER BY COUNT(s) DESC
            """)
    List<Object[]> getCityStatistics();

}