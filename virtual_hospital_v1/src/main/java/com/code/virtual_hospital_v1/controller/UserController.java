package com.code.virtual_hospital_v1.controller;

import com.code.virtual_hospital_v1.dto.UserRequest;
import com.code.virtual_hospital_v1.dto.UserResponse;
import com.code.virtual_hospital_v1.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService service;

    @DeleteMapping("/deletion/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        service.deleteUser(id);
        return new ResponseEntity<>("User deleted successfully.", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return new ResponseEntity<>(service.getAllUsers(), HttpStatus.FOUND);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody UserRequest ur){
        return new ResponseEntity<>(service.login(ur), HttpStatus.OK);
    }


}
