package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.ConsultationLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationLocationRepo extends JpaRepository<ConsultationLocation, Long> {
}
