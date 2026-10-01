package com.ecommerce.dto;

import java.util.ArrayList;
import java.util.List;

public class AiChatResponse {
    private String reply;
    private String intent;
    private List<String> suggestedActions = new ArrayList<>();
    private List<ProductDto> products = new ArrayList<>();
    private OrderDto order;

    public AiChatResponse() {}

    public AiChatResponse(String reply, String intent, List<String> suggestedActions, List<ProductDto> products, OrderDto order) {
        this.reply = reply;
        this.intent = intent;
        this.suggestedActions = suggestedActions != null ? suggestedActions : new ArrayList<>();
        this.products = products != null ? products : new ArrayList<>();
        this.order = order;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }

    public List<String> getSuggestedActions() { return suggestedActions; }
    public void setSuggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; }

    public List<ProductDto> getProducts() { return products; }
    public void setProducts(List<ProductDto> products) { this.products = products; }

    public OrderDto getOrder() { return order; }
    public void setOrder(OrderDto order) { this.order = order; }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String reply;
        private String intent;
        private List<String> suggestedActions = new ArrayList<>();
        private List<ProductDto> products = new ArrayList<>();
        private OrderDto order;

        public Builder reply(String reply) { this.reply = reply; return this; }
        public Builder intent(String intent) { this.intent = intent; return this; }
        public Builder suggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; return this; }
        public Builder products(List<ProductDto> products) { this.products = products; return this; }
        public Builder order(OrderDto order) { this.order = order; return this; }

        public AiChatResponse build() {
            return new AiChatResponse(reply, intent, suggestedActions, products, order);
        }
    }
}
