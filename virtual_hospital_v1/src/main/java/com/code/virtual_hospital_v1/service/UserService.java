package com.code.virtual_hospital_v1.service;

import com.code.virtual_hospital_v1.dto.UserRequest;
import com.code.virtual_hospital_v1.dto.UserResponse;
import com.code.virtual_hospital_v1.exception.InvalidPasswordException;
import com.code.virtual_hospital_v1.exception.InvalidUsernameException;
import com.code.virtual_hospital_v1.exception.UsernameConflictException;
import com.code.virtual_hospital_v1.model.Role;
import com.code.virtual_hospital_v1.model.User;
import com.code.virtual_hospital_v1.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private final UserRepo repo;
    private final PasswordEncoder passwordEncoder;

    //Constructor injection
    public UserService(UserRepo repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    //User Services
    public Long registerUser(String username, String password, Role role){
        if(repo.existsByUsername(username)){
            throw new UsernameConflictException(username); //Here execution stops and spring creates http response for this exception.
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        return repo.save(user).getId();
    }

    public void deleteUser(Long id){
        User user = repo.findById(id).orElse(null);

        if(user == null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        repo.deleteById(id);
    }

    public List<UserResponse> getAllUsers(){
        return repo.findAll().stream().map(u -> UserResponse.fromUser(u)).toList();
    }

    public UserResponse login(UserRequest ur){
        User user = repo.findByUsername(ur.getUsername());
        if(user == null){
            throw new InvalidUsernameException(ur.getUsername());
        }

        if(!passwordEncoder.matches(ur.getPassword(), user.getPassword())){
            throw new InvalidPasswordException(ur.getUsername());
        }

        return UserResponse.fromUser(user);
    }

}
