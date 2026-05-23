package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.ConsultationLocation;
import lombok.Data;

@Data
public class ConsultationLocationRequest {
    private String hospitalName;
    private String address;
    private String floor;
    private String room;
    private Long doctorId;

    public static ConsultationLocation toConsultationLocation(ConsultationLocationRequest request){
        ConsultationLocation location = new ConsultationLocation();

        location.setHospitalName(request.getHospitalName());
        location.setAddress(request.getAddress());
        location.setFloor(request.getFloor());
        location.setRoom(request.getRoom());

        return location;
    }
}
