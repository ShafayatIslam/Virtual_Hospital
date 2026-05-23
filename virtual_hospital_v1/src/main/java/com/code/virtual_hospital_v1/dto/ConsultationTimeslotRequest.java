package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.ConsultationDay;
import com.code.virtual_hospital_v1.model.ConsultationTimeslot;
import com.code.virtual_hospital_v1.model.WeekDay;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class ConsultationTimeslotRequest {

    private LocalTime startTime;
    private LocalTime endTime;
    private Integer maxPatients;
    private Long locationId;
    private List<WeekDay> days;

    public static ConsultationTimeslot toConsultationTimeslot(ConsultationTimeslotRequest request){
        ConsultationTimeslot timeslot = new ConsultationTimeslot();

        timeslot.setStartTime(request.getStartTime());
        timeslot.setEndTime(request.getEndTime());
        timeslot.setMaxPatients(request.getMaxPatients());
        for(WeekDay day : request.getDays()){
            ConsultationDay consultationDay = new ConsultationDay();
            consultationDay.setDay(day);
            consultationDay.setTimeslot(timeslot);
            timeslot.getDays().add(consultationDay);
        }

        return timeslot;
    }
}
