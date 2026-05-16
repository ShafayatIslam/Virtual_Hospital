package com.code.virtual_hospital_v1.exception;

public class UsernameConflictException extends RuntimeException {
    public UsernameConflictException(String username) {
        super("Username: "+username+" already exists!");
    }
}
