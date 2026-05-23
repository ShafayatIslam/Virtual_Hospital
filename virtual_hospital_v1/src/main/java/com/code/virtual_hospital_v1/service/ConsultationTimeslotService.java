package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.ConsultationTimeslotRequest;
import com.code.virtual_hospital_v1.model.ConsultationDay;
import com.code.virtual_hospital_v1.model.ConsultationTimeslot;
import com.code.virtual_hospital_v1.model.WeekDay;
import com.code.virtual_hospital_v1.repository.ConsultationLocationRepo;
import com.code.virtual_hospital_v1.repository.ConsultationTimeslotRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConsultationTimeslotService {
    final private ConsultationTimeslotRepo timeslotRepo;
    final private ConsultationLocationRepo locationRepo;

    public ConsultationTimeslotService(ConsultationTimeslotRepo timeslotRepo, ConsultationLocationRepo locationRepo) {
        this.timeslotRepo = timeslotRepo;
        this.locationRepo = locationRepo;
    }

    public void saveConsultationTimeslot(ConsultationTimeslotRequest request){
        if(request.getStartTime().isAfter(request.getEndTime())){
            throw new IllegalArgumentException("Invalid Timeslot!");
        }
        ConsultationTimeslot timeslot = ConsultationTimeslotRequest.toConsultationTimeslot(request);
        timeslot.setLocation(locationRepo.findById(request.getLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation Location Not Found!")));
        timeslotRepo.save(timeslot);
    }

    public void updateConsultationTimeslot(Long id, ConsultationTimeslotRequest request){
        ConsultationTimeslot timeslot = timeslotRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation Timeslot Not Found!"));
        if(request.getStartTime().isAfter(request.getEndTime())){
            throw new IllegalArgumentException("Invalid Timeslot!");
        }

        timeslot.setStartTime(request.getStartTime());
        timeslot.setEndTime(request.getEndTime());
        timeslot.setMaxPatients(request.getMaxPatients());

        timeslot.getDays().clear();
        for(WeekDay day : request.getDays()){
            ConsultationDay consultationDay = new ConsultationDay();
            consultationDay.setDay(day);
            consultationDay.setTimeslot(timeslot);
            timeslot.getDays().add(consultationDay);
        }

        timeslotRepo.save(timeslot);
    }

    public void deleteConsultationTimeslot(Long id){
        if(!timeslotRepo.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation Timeslot Not Found!");
        timeslotRepo.deleteById(id);
    }
}
