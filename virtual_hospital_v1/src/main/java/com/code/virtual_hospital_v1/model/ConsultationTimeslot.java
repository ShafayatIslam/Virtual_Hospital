package com.code.virtual_hospital_v1.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "consultation_timeslot")
@Data
public class ConsultationTimeslot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_patients", nullable = false)
    private Integer maxPatients;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private ConsultationLocation location;

    @OneToMany(
            mappedBy = "timeslot",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ConsultationDay> days = new ArrayList<>();
}
