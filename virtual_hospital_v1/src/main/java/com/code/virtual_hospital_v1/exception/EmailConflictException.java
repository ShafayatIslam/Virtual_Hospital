package com.code.virtual_hospital_v1.exception;

public class EmailConflictException extends RuntimeException{
    public EmailConflictException(){
        super("Email already exists.");
    }
}
