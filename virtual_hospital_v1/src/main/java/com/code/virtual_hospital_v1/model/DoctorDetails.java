package com.code.virtual_hospital_v1.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "doctor_details")
public class DoctorDetails {

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

    @Column(nullable = false, unique = true)
    private String license;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    private String experience;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(name = "pic_url")
    private String picUrl;

}
