package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.PatientDetails;
import com.code.virtual_hospital_v1.model.Role;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDetailsRequest {
    private String username;
    private Role role;
    private String password;

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String bloodGroup;
    private String emergencyContact;
    private String emergencyContactRelation;
    private String address;
    private String picUrl;

    private PatientDetailsRequest(){}

    public static PatientDetails toPatientDetails(PatientDetailsRequest pdr){
        PatientDetails patient = new PatientDetails();

        patient.setFullName(pdr.getFullName());
        patient.setEmail(pdr.getEmail());
        patient.setPhone(pdr.getPhone());
        patient.setGender(pdr.getGender());
        patient.setDateOfBirth(pdr.getDateOfBirth());
        patient.setBloodGroup(pdr.getBloodGroup());
        patient.setEmergencyContact(pdr.getEmergencyContact());
        patient.setEmergencyContactRelation(pdr.getEmergencyContactRelation());
        patient.setAddress(pdr.getAddress());
        patient.setPicUrl(pdr.getPicUrl());

        return patient;
    }
}
