package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.PatientDetails;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientDetailsResponse {

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

    private PatientDetailsResponse(){}

    public static PatientDetailsResponse fromPatientDetails(PatientDetails details){
        PatientDetailsResponse response = new PatientDetailsResponse();

        response.fullName = details.getFullName();
        response.email = details.getEmail();
        response.phone = details.getPhone();
        response.gender = details.getGender();
        response.dateOfBirth =details.getDateOfBirth();
        response.bloodGroup = details.getBloodGroup();
        response.emergencyContact = details.getEmergencyContact();
        response.emergencyContactRelation = details.getEmergencyContactRelation();
        response.address = details.getAddress();
        response.picUrl = details.getPicUrl();

        return response;
    }
}
