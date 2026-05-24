package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.DoctorDetails;
import lombok.Data;

@Data
public class DoctorDetailsResponse {

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

    private DoctorDetailsResponse(){}

    public static DoctorDetailsResponse fromDoctorDetails(DoctorDetails details){
        DoctorDetailsResponse response = new DoctorDetailsResponse();

        response.fullName = details.getFullName();
        response.email = details.getEmail();
        response.phone = details.getPhone();
        response.gender = details.getGender();
        response.license = details.getLicense();
        response.specialization = details.getSpecialization();
        response.qualification = details.getQualification();
        response.experience = details.getExperience();
        response.consultationFee = details.getConsultationFee();
        response.about = details.getAbout();
        response.picUrl = details.getPicUrl();

        return response;
    }
}
