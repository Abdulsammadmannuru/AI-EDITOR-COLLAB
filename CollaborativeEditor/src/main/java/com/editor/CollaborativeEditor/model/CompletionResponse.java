package com.editor.CollaborativeEditor.model;



public class CompletionResponse {
    
    private String suggestion;
    private String description;
    private int confidence;
    private String source;
    
    public CompletionResponse() {
    }
    
    public CompletionResponse(String suggestion, String description, int confidence, String source) {
        this.suggestion = suggestion;
        this.description = description;
        this.confidence = confidence;
        this.source = source;
    }
    
    public String getSuggestion() {
        return suggestion;
    }
    
    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public int getConfidence() {
        return confidence;
    }
    
    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }
    
    public String getSource() {
        return source;
    }
    
    public void setSource(String source) {
        this.source = source;
    }
}