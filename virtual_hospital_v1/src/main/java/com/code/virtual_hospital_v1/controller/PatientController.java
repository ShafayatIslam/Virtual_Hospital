package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.PatientDetailsRequest;
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
        Long id = userService.registerUser(request.getUsername(), request.getPassword(), request.getRole());

        request.setUserId(id);
        patientService.savePatientDetails(request);

        return new ResponseEntity<>("Registration successful", HttpStatus.CREATED);
    }
}
