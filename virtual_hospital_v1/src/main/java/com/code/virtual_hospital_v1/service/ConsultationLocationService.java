package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.ConsultationLocationRequest;
import com.code.virtual_hospital_v1.exception.UserNotFoundException;
import com.code.virtual_hospital_v1.model.ConsultationLocation;
import com.code.virtual_hospital_v1.repository.ConsultationLocationRepo;
import com.code.virtual_hospital_v1.repository.DoctorDetailsRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConsultationLocationService {

    final private ConsultationLocationRepo locationRepo;
    final private DoctorDetailsRepo doctorRepo;

    public ConsultationLocationService(ConsultationLocationRepo locationRepo, DoctorDetailsRepo doctorRepo) {
        this.locationRepo = locationRepo;
        this.doctorRepo = doctorRepo;
    }

    public void saveConsultationLocation(ConsultationLocationRequest request){
        ConsultationLocation location = ConsultationLocationRequest.toConsultationLocation(request);
        location.setDoctor(doctorRepo.findById(request.getDoctorId()).orElseThrow(() -> new UserNotFoundException()));
        locationRepo.save(location);
    }

    public void updateConsultationLocation(Long id, ConsultationLocationRequest request){
        ConsultationLocation location = locationRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation Location Not Found!"));

        location.setHospitalName(request.getHospitalName());
        location.setAddress(request.getAddress());
        location.setFloor(request.getFloor());
        location.setRoom(request.getRoom());

        locationRepo.save(location);
    }

    public void deleteConsultationLocation(Long id){
        if(!locationRepo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation Location Not Found!");
        locationRepo.deleteById(id);
    }
}
