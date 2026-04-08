package com.securecode.analyzer.exception;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.toList());

        log.warn("Validation failed: {}", errors);

        return ResponseEntity.badRequest().body(
                errorBody(HttpStatus.BAD_REQUEST, "Validation failed", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraint(ConstraintViolationException ex) {
        log.warn("Constraint violation: {}", ex.getMessage());

        return ResponseEntity.badRequest().body(
                errorBody(HttpStatus.BAD_REQUEST, ex.getMessage(), null));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException ex) {
        log.warn("Unreadable request body: {}", ex.getMessage());

        return ResponseEntity.badRequest().body(
                errorBody(HttpStatus.BAD_REQUEST, "Request body is malformed or missing.", null));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArg(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());

        return ResponseEntity.badRequest().body(
                errorBody(HttpStatus.BAD_REQUEST, ex.getMessage(), null));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException ex) {

        String message = ex.getMessage() != null ? ex.getMessage().toLowerCase() : "";

        if (message.contains("rate limit")) {
            log.warn("Rate limit hit: {}", ex.getMessage());

            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                    errorBody(HttpStatus.TOO_MANY_REQUESTS,
                            "Too many requests. Please wait a few seconds and try again.", null));
        }

        if (message.contains("api key") || message.contains("unauthorized")) {
            log.error("Authentication error: {}", ex.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    errorBody(HttpStatus.UNAUTHORIZED,
                            "Invalid or missing API key.", null));
        }

        if (message.contains("openai")) {
            log.error("OpenAI error: {}", ex.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(
                    errorBody(HttpStatus.BAD_GATEWAY,
                            "AI service is temporarily unavailable. Please try again.", null));
        }

        log.error("Runtime exception: ", ex);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                errorBody(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Something went wrong. Please try again.", null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        log.error("Unhandled exception", ex);

        return ResponseEntity.internalServerError().body(
                errorBody(HttpStatus.INTERNAL_SERVER_ERROR,
                        "An unexpected error occurred. Please try again later.", null));
    }

    private Map<String, Object> errorBody(HttpStatus status, String message, List<String> details) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        if (details != null && !details.isEmpty()) {
            body.put("details", details);
        }

        return body;
    }
}