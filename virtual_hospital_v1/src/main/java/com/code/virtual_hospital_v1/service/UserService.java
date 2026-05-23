package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.DoctorDetailsRequest;
import com.code.virtual_hospital_v1.dto.PatientDetailsRequest;
import com.code.virtual_hospital_v1.dto.UserRequest;
import com.code.virtual_hospital_v1.dto.UserResponse;
import com.code.virtual_hospital_v1.exception.*;
import com.code.virtual_hospital_v1.model.DoctorDetails;
import com.code.virtual_hospital_v1.model.PatientDetails;
import com.code.virtual_hospital_v1.model.Role;
import com.code.virtual_hospital_v1.model.User;
import com.code.virtual_hospital_v1.repository.DoctorDetailsRepo;
import com.code.virtual_hospital_v1.repository.PatientDetailsRepo;
import com.code.virtual_hospital_v1.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    final private UserRepo repo;
    final private PatientDetailsRepo patientRepo;
    final private DoctorDetailsRepo doctorRepo;
    final private  PasswordEncoder passwordEncoder;

    //Constructor injection
    public UserService(UserRepo repo, PatientDetailsRepo patientRepo, DoctorDetailsRepo doctorRepo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
        this.passwordEncoder = passwordEncoder;
    }

    //Registration
    public void registerPatient(PatientDetailsRequest request){
        if(repo.existsByUsername(request.getUsername())){
            throw new UsernameConflictException(request.getUsername()); //Here execution stops and spring creates http response for this exception.
        }
        if(patientRepo.existsByEmail(request.getEmail()) || doctorRepo.existsByEmail(request.getEmail())){
            throw new EmailConflictException();
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = repo.save(user);

        PatientDetails details = PatientDetailsRequest.toPatientDetails(request);
        details.setUser(savedUser);
        patientRepo.save(details);
    }

    public void registerDoctor(DoctorDetailsRequest request){
        if(repo.existsByUsername(request.getUsername())){
            throw new UsernameConflictException(request.getUsername()); //Here execution stops and spring creates http response for this exception.
        }
        if(patientRepo.existsByEmail(request.getEmail()) || doctorRepo.existsByEmail(request.getEmail())){
            throw new EmailConflictException();
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        User savedUser = repo.save(user);

        DoctorDetails details = DoctorDetailsRequest.toDoctorDetails(request);
        details.setUser(savedUser);
        doctorRepo.save(details);
    }

    public void deleteUser(Long id){
        User user = repo.findById(id).orElse(null);

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        repo.deleteById(id);
    }

    public List<UserResponse> getAllUsers(){
        return repo.findAll().stream().map(u -> UserResponse.fromUser(u)).toList();
    }

    public UserResponse login(UserRequest ur){
        User user = repo.findByUsername(ur.getUsername());
        if(user == null){
            throw new InvalidUsernameOrPasswordException();
        }
        if(!passwordEncoder.matches(ur.getPassword(), user.getPassword())){
            throw new InvalidUsernameOrPasswordException();
        }

        return UserResponse.fromUser(user);
    }

}
