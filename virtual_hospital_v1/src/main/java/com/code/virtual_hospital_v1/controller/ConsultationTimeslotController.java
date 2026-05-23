package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.ConsultationTimeslotRequest;
import com.code.virtual_hospital_v1.service.ConsultationTimeslotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/doctor")
public class ConsultationTimeslotController {
    final private ConsultationTimeslotService timeslotService;

    public ConsultationTimeslotController(ConsultationTimeslotService timeslotService) {
        this.timeslotService = timeslotService;
    }

    @PostMapping("/consultation-timeslot")
    public ResponseEntity<String> saveConsultationTimeslot(@RequestBody ConsultationTimeslotRequest request){
        timeslotService.saveConsultationTimeslot(request);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Timeslot Saved Successfully.");
    }

    @PutMapping("/consultation-timeslot/{id}")
    public ResponseEntity<String> updateConsultationTimeslot(@PathVariable Long id, @RequestBody ConsultationTimeslotRequest request){
        timeslotService.updateConsultationTimeslot(id, request);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Timeslot Updated Successfully.");
    }

    @DeleteMapping("/consultation-timeslot/{id}")
    public ResponseEntity<String> deleteConsultationTimeslot(@PathVariable Long id){
        timeslotService.deleteConsultationTimeslot(id);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Timeslot Deleted Successfully.");
    }
}
