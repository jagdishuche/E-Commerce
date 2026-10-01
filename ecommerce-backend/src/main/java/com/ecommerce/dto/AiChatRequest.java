package com.ecommerce.dto;

public class AiChatRequest {
    private String message;
    private String conversationId;
    private String currentPath;

    public AiChatRequest() {}

    public AiChatRequest(String message, String conversationId, String currentPath) {
        this.message = message;
        this.conversationId = conversationId;
        this.currentPath = currentPath;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getCurrentPath() { return currentPath; }
    public void setCurrentPath(String currentPath) { this.currentPath = currentPath; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String message;
        private String conversationId;
        private String currentPath;

        public Builder message(String message) { this.message = message; return this; }
        public Builder conversationId(String conversationId) { this.conversationId = conversationId; return this; }
        public Builder currentPath(String currentPath) { this.currentPath = currentPath; return this; }

        public AiChatRequest build() {
            return new AiChatRequest(message, conversationId, currentPath);
        }
    }
}
