package com.code.virtual_hospital_v1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "patient_details")
@Data
public class PatientDetails {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "emergency_contact_relation")
    private String emergencyContactRelation;

    private String address;

    @Column(name = "pic_url")
    private String picUrl;
}
