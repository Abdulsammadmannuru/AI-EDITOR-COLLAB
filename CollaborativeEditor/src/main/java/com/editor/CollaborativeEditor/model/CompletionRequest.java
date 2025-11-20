package com.editor.CollaborativeEditor.model;



public class CompletionRequest {
    
    private String code;
    private int cursorPosition;
    private String language;
    private int maxSuggestions;
    
    public CompletionRequest() {
    }
    
    public CompletionRequest(String code, int cursorPosition, String language, int maxSuggestions) {
        this.code = code;
        this.cursorPosition = cursorPosition;
        this.language = language;
        this.maxSuggestions = maxSuggestions;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public int getCursorPosition() {
        return cursorPosition;
    }
    
    public void setCursorPosition(int cursorPosition) {
        this.cursorPosition = cursorPosition;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public int getMaxSuggestions() {
        return maxSuggestions;
    }
    
    public void setMaxSuggestions(int maxSuggestions) {
        this.maxSuggestions = maxSuggestions;
    }
}