package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.PatientDetailsRequest;
import com.code.virtual_hospital_v1.model.PatientDetails;
import com.code.virtual_hospital_v1.repository.PatientDetailsRepo;
import com.code.virtual_hospital_v1.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    final private UserRepo userRepo;
    final private PatientDetailsRepo patientRepo;

    public PatientService(UserRepo userRepo, PatientDetailsRepo patientRepo) {
        this.userRepo = userRepo;
        this.patientRepo = patientRepo;
    }

    public void savePatientDetails(PatientDetailsRequest request){
        PatientDetails details = PatientDetailsRequest.toPatientDetails(request);
        details.setUser(userRepo.findById(request.getUserId()).orElse(null));
        patientRepo.save(details);
    }
}
