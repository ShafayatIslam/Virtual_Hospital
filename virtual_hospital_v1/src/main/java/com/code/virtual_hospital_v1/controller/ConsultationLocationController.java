package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.ConsultationLocationRequest;
import com.code.virtual_hospital_v1.service.ConsultationLocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/doctor")
public class ConsultationLocationController {
    final private ConsultationLocationService service;

    public ConsultationLocationController(ConsultationLocationService service) {
        this.service = service;
    }

    @PostMapping("/consultation-location")
    public ResponseEntity<String> saveConsultationLocation(@RequestBody ConsultationLocationRequest request){
        service.saveConsultationLocation(request);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Location Saved Successfully.");
    }

    @PutMapping("/consultation-location/{id}")
    public ResponseEntity<String> updateConsultationLocation(@PathVariable Long id, @RequestBody ConsultationLocationRequest request){
        service.updateConsultationLocation(id, request);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Location Updated Successfully.");
    }

    @DeleteMapping("/consultation-location/{id}")
    public ResponseEntity<String> deleteConsultationLocation(@PathVariable Long id){
        service.deleteConsultationLocation(id);
        return ResponseEntity.status(HttpStatus.OK).body("Consultation Location Deleted Successfully.");
    }
}
