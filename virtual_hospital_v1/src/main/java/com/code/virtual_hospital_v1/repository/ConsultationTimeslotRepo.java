package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.ConsultationTimeslot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationTimeslotRepo extends JpaRepository<ConsultationTimeslot, Long> {
}
