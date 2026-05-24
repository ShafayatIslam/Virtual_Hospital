package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.DoctorDetailsRequest;
import com.code.virtual_hospital_v1.dto.DoctorDetailsResponse;
import com.code.virtual_hospital_v1.exception.UserNotFoundException;
import com.code.virtual_hospital_v1.model.DoctorDetails;
import com.code.virtual_hospital_v1.repository.DoctorDetailsRepo;
import com.code.virtual_hospital_v1.repository.UserRepo;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    final private UserRepo userRepo;
    final private DoctorDetailsRepo doctorRepo;

    public DoctorService(UserRepo userRepo, DoctorDetailsRepo doctorRepo) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }

    public DoctorDetailsResponse getDoctorDetails(Long id){
        DoctorDetails details = doctorRepo.findById(id).orElseThrow(() -> new UserNotFoundException());
        return DoctorDetailsResponse.fromDoctorDetails(details);
    }

    public void updateDoctorDetails(Long id, DoctorDetailsRequest request){
        DoctorDetails details = doctorRepo.findById(id).orElseThrow(() -> new UserNotFoundException());

        if(request.getConsultationFee() < 0)
            throw new IllegalArgumentException("Consultation fee can not be negative!");

        details.setFullName(request.getFullName());
        details.setEmail(request.getEmail());
        details.setPhone(request.getPhone());
        details.setGender(request.getGender());
        details.setExperience(request.getExperience());
        details.setSpecialization(request.getSpecialization());
        details.setQualification(request.getQualification());
        details.setAbout(request.getAbout());
        details.setConsultationFee(request.getConsultationFee());
        details.setPicUrl(request.getPicUrl());

        doctorRepo.save(details);
    }
}
