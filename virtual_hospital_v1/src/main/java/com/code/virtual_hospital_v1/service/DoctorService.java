package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.DoctorDetailsRequest;
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

    public void saveDoctorDetails(DoctorDetailsRequest request){
        DoctorDetails details = DoctorDetailsRequest.toDoctorDetails(request);
        details.setUser(userRepo.findById(request.getUserId()).orElse(null));
        doctorRepo.save(details);
    }
}
