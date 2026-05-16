package com.code.virtual_hospital_v1.repository;

import com.code.virtual_hospital_v1.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
}
