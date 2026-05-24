package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.PatientDetailsRequest;
import com.code.virtual_hospital_v1.dto.PatientDetailsResponse;
import com.code.virtual_hospital_v1.service.PatientService;
import com.code.virtual_hospital_v1.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class PatientController {


    final private UserService userService;
    final private PatientService patientService;

    public PatientController(UserService userService, PatientService patientService) {
        this.userService = userService;
        this.patientService = patientService;
    }

    @PostMapping("/patient/registration")
    public ResponseEntity<String> patientRegistration(@RequestBody PatientDetailsRequest request){
        userService.registerPatient(request);
        return new ResponseEntity<>("Registration successful", HttpStatus.CREATED);
    }

    @GetMapping("/patient/details/{id}")
    public ResponseEntity<PatientDetailsResponse> getPatientDetails(@PathVariable Long id){
        PatientDetailsResponse response = patientService.getPatientDetails(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("patient/details/{id}")
    public ResponseEntity<String> updatePatientDetails(@PathVariable Long id, @RequestBody PatientDetailsRequest request){
        patientService.updatePatientDetails(id, request);
        return ResponseEntity.status(HttpStatus.OK).body("Details Updated Successfully.");
    }
}
