package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.PatientDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientDetailsRepo extends JpaRepository<PatientDetails, Long> {
    boolean existsByEmail(String email);
}
