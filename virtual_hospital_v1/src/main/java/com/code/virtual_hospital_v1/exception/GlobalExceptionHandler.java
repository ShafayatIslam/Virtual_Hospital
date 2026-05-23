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

    @ExceptionHandler(EmailConflictException.class)
    public ResponseEntity<ErrorResponse> handleEmailConflict(EmailConflictException ex){
        ErrorResponse response = new ErrorResponse(
                112,
                "Email Conflict",
                ex.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(InvalidUsernameOrPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUsernameOrPassword(InvalidUsernameOrPasswordException exc){
        ErrorResponse response = new ErrorResponse(
                113,
                "Invalid Username or Password!!",
                exc.getMessage(),
                LocalDateTime.now().toString()
        );

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
