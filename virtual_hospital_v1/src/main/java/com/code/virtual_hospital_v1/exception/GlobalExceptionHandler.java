package com.code.virtual_hospital_v1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameConflictException.class)
    public ResponseEntity<ErrorResponse> handleUsernameConflict(UsernameConflictException ex){
        ErrorResponse response = new ErrorResponse(
                111,
                "Username Conflict",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(InvalidUsernameException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUsername(InvalidUsernameException ex){
        ErrorResponse error = new ErrorResponse(
                404,
                "Not Found",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPassword(InvalidPasswordException ex){
        ErrorResponse error = new ErrorResponse(
                405,
                "Invalid Password",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
