package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.DoctorDetailsRequest;
import com.code.virtual_hospital_v1.dto.DoctorDetailsResponse;
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
        userService.registerDoctor(request);
        return new ResponseEntity<>("Registration successful", HttpStatus.CREATED);
    }

    @GetMapping("doctor/details/{id}")
    public ResponseEntity<DoctorDetailsResponse> getDoctorDetails(@PathVariable Long id){
        DoctorDetailsResponse response = doctorService.getDoctorDetails(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("doctor/details/{id}")
    public ResponseEntity<String> updateDoctorDetails(@PathVariable Long id, @RequestBody DoctorDetailsRequest request){
        doctorService.updateDoctorDetails(id, request);
        return ResponseEntity.status(HttpStatus.OK).body("Details Updated Successfully.");
    }
}
