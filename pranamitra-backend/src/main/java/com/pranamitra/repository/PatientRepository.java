package com.pranamitra.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pranamitra.entity.Patient;
import com.pranamitra.enums.BloodGroup;
import com.pranamitra.enums.RequestStatus;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByBloodGroup(BloodGroup bloodGroup);

    List<Patient> findByRequestStatus(RequestStatus requestStatus);

    List<Patient> findByCityIgnoreCase(String city);

    List<Patient> findByHospitalNameContainingIgnoreCase(String hospitalName);

}