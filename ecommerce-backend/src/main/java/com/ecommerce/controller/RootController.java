package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "E-Commerce REST API & Nova AI Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", LocalDateTime.now());
        response.put("health", "/api/health");
        response.put("endpoints", Map.of(
                "products", "/api/products",
                "categories", "/api/categories",
                "auth", "/api/auth/login",
                "aiChat", "/api/ai/chat"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Service is healthy and ready to accept traffic");
        return ResponseEntity.ok(response);
    }
}
