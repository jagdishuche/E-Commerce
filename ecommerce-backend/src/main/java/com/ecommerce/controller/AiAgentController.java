package com.ecommerce.controller;

import com.ecommerce.dto.AiChatRequest;
import com.ecommerce.dto.AiChatResponse;
import com.ecommerce.dto.ApiResponse;
import com.ecommerce.service.AiAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiAgentController {

    private final AiAgentService aiAgentService;

    public AiAgentController(AiAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            Authentication authentication,
            @RequestBody AiChatRequest request
    ) {
        String userEmail = authentication != null ? authentication.getName() : null;
        AiChatResponse response = aiAgentService.processChat(userEmail, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(Authentication authentication) {
        String userEmail = authentication != null ? authentication.getName() : null;
        List<String> suggestions = aiAgentService.getSuggestedPrompts(userEmail);
        return ResponseEntity.ok(ApiResponse.success(suggestions));
    }
}
