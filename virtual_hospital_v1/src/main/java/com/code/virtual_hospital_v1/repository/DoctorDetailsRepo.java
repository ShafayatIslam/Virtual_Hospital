package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.DoctorDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorDetailsRepo extends JpaRepository<DoctorDetails, Long> {
    boolean existsByEmail(String email);
}
