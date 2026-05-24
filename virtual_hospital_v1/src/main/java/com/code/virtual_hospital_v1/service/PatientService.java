package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.PatientDetailsRequest;
import com.code.virtual_hospital_v1.dto.PatientDetailsResponse;
import com.code.virtual_hospital_v1.exception.UserNotFoundException;
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

    public PatientDetailsResponse getPatientDetails(Long id){
        PatientDetails details = patientRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException());
        return PatientDetailsResponse.fromPatientDetails(details);
    }

    public void updatePatientDetails(Long id, PatientDetailsRequest request){
        PatientDetails details = patientRepo.findById(id).orElseThrow(() -> new UserNotFoundException());

        details.setFullName(request.getFullName());
        details.setEmail(request.getEmail());
        details.setPhone(request.getPhone());
        details.setGender(request.getGender());
        details.setDateOfBirth(request.getDateOfBirth());
        details.setBloodGroup(request.getBloodGroup());
        details.setEmergencyContact(request.getEmergencyContact());
        details.setEmergencyContactRelation(request.getEmergencyContactRelation());
        details.setAddress(request.getAddress());
        details.setPicUrl(request.getPicUrl());

        patientRepo.save(details);
    }
}
