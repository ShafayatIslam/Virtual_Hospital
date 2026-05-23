package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.ConsultationDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationDayRepo extends JpaRepository<ConsultationDay, Long> {
}
