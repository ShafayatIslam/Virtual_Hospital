package com.code.virtual_hospital_v1.exception;

public class InvalidPasswordException extends RuntimeException{

    public InvalidPasswordException(String username){
        super("Password is incorrect for username: "+username);
    }
}
