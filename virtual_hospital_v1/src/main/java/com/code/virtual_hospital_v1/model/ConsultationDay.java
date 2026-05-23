package com.code.virtual_hospital_v1.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "consultation_day")
@Data
public class ConsultationDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "timeslot_id", nullable = false)
    private ConsultationTimeslot timeslot;

    @Enumerated(EnumType.STRING)
    @Column(name = "day", nullable = false)
    private WeekDay day;

}
