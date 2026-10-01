package com.ecommerce.service;

import com.ecommerce.dto.AiChatRequest;
import com.ecommerce.dto.AiChatResponse;

import java.util.List;

public interface AiAgentService {
    AiChatResponse processChat(String userEmail, AiChatRequest request);
    List<String> getSuggestedPrompts(String userEmail);
}
