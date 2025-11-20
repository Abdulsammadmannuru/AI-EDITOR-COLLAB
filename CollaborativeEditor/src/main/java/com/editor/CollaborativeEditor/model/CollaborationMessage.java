package com.editor.CollaborativeEditor.model;



public class CollaborationMessage {
    
    private String roomId;
    private String userId;
    private String content;
    private String operation;
    private long timestamp;
    private Object metadata;
    
    public CollaborationMessage() {
    }
    
    public CollaborationMessage(String roomId, String userId, String content, String operation) {
        this.roomId = roomId;
        this.userId = userId;
        this.content = content;
        this.operation = operation;
        this.timestamp = System.currentTimeMillis();
    }
    
    public String getRoomId() {
        return roomId;
    }
    
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getOperation() {
        return operation;
    }
    
    public void setOperation(String operation) {
        this.operation = operation;
    }
    
    public long getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
    
    public Object getMetadata() {
        return metadata;
    }
    
    public void setMetadata(Object metadata) {
        this.metadata = metadata;
    }
}