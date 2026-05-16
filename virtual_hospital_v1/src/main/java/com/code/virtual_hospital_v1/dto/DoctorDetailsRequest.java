package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.DoctorDetails;
import com.code.virtual_hospital_v1.model.Role;
import lombok.Data;

@Data
public class DoctorDetailsRequest {

    private String username;
    private Role role;
    private String password;

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String license;
    private String specialization;
    private String qualification;
    private String experience;
    private Double consultationFee;
    private String about;
    private String picUrl;



    public static DoctorDetails toDoctorDetails(DoctorDetailsRequest ddr){
        DoctorDetails doctor = new DoctorDetails();

        doctor.setFullName(ddr.getFullName());
        doctor.setEmail(ddr.getEmail());
        doctor.setPhone(ddr.getPhone());
        doctor.setGender(ddr.getGender());
        doctor.setLicense(ddr.getLicense());
        doctor.setSpecialization(ddr.getSpecialization());
        doctor.setQualification(ddr.getQualification());
        doctor.setExperience(doctor.getExperience());
        doctor.setConsultationFee(ddr.getConsultationFee());
        doctor.setAbout(ddr.getAbout());
        doctor.setPicUrl(ddr.getPicUrl());

        return doctor;
    }
}
