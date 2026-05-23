package com.code.virtual_hospital_v1.exception;

public class InvalidUsernameOrPasswordException extends RuntimeException{
    public InvalidUsernameOrPasswordException(){
        super("Invalid username or password.");
    }
}
