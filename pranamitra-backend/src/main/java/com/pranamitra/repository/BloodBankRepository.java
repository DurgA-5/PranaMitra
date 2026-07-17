package com.pranamitra.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.BloodBank;

@Repository
public interface BloodBankRepository extends JpaRepository<BloodBank, Long> {

    // ==================================================
    // Basic Queries
    // ==================================================

    Optional<BloodBank> findByEmail(String email);

    Optional<BloodBank> findByLicenseNumber(String licenseNumber);

    @Query("SELECT b FROM BloodBank b WHERE UPPER(b.city) = UPPER(:city)")
    List<BloodBank> findByCityIgnoreCase(String city);

    List<BloodBank> findByStateIgnoreCase(String state);

    boolean existsByEmail(String email);

    boolean existsByLicenseNumber(String licenseNumber);

    // ==================================================
    // Reports & Analytics
    // ==================================================

    @Query("""
            SELECT b.city, COUNT(b)
            FROM BloodBank b
            GROUP BY b.city
            ORDER BY COUNT(b) DESC
            """)
    List<Object[]> getBloodBankCityStatistics();

    @Query("""
            SELECT COUNT(b)
            FROM BloodBank b
            WHERE b.active = true
            """)
    Long getActiveBloodBankCount();

    @Query("""
            SELECT COUNT(b)
            FROM BloodBank b
            WHERE b.available24Hours = true
            """)
    Long getTwentyFourHourBloodBankCount();

}