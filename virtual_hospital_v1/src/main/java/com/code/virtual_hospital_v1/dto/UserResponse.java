package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.Role;
import com.code.virtual_hospital_v1.model.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String password;
    private Role role;

    private UserResponse(){}

    public static UserResponse fromUser(User u){
        UserResponse response = new UserResponse();

        response.id = u.getId();
        response.username = u.getUsername();
        response.role = u.getRole();

        return response;
    }
}
