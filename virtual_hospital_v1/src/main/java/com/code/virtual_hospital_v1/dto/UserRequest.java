package com.code.virtual_hospital_v1.dto;

import com.code.virtual_hospital_v1.model.Role;
import com.code.virtual_hospital_v1.model.User;
import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private Role role;

    private UserRequest(){}

    public static User toUser(UserRequest ur){
        User user = new User();

        user.setUsername(ur.getUsername());
        user.setPassword(ur.getPassword());
        user.setRole(ur.getRole());

        return user;
    }
}
