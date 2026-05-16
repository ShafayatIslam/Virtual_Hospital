package com.code.virtual_hospital_v1.exception;

public class InvalidUsernameException extends RuntimeException{

    public InvalidUsernameException(String username){
        super("User not found with username: "+username);
    }
}
