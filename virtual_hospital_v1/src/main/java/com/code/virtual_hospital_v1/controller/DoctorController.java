package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.DoctorDetailsRequest;
import com.code.virtual_hospital_v1.service.DoctorService;
import com.code.virtual_hospital_v1.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class DoctorController {

    final private UserService userService;
    final private DoctorService doctorService;

    public DoctorController(UserService userService, DoctorService doctorService) {
        this.userService = userService;
        this.doctorService = doctorService;
    }

    @PostMapping("/doctor/registration")
    public ResponseEntity<String> doctorRegistration(@RequestBody DoctorDetailsRequest request){
        Long id = userService.registerUser(request.getUsername(), request.getPassword(), request.getRole());

        request.setUserId(id);
        doctorService.saveDoctorDetails(request);

        return new ResponseEntity<>("Registration successful", HttpStatus.CREATED);
    }
}
