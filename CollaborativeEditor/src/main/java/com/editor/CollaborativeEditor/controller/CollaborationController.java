package com.editor.CollaborativeEditor.controller;



//import com.editor.model.CollaborativeEditor.CollaborationMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.editor.CollaborativeEditor.model.CollaborationMessage;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class CollaborationController {

    private final Map<String, Integer> activeRooms = new ConcurrentHashMap<>();

    @MessageMapping("/collaborate")
    @SendTo("/topic/collaboration")
    public CollaborationMessage handleCollaboration(@Payload CollaborationMessage message) {
        
        String roomId = message.getRoomId();
        String userId = message.getUserId();
        String operation = message.getOperation();
        
        System.out.println("📨 WebSocket: " + operation + " from " + userId + " in room " + roomId);
        
        switch (operation) {
            case "join":
                activeRooms.merge(roomId, 1, Integer::sum);
                System.out.println("✅ User joined. Active: " + activeRooms.get(roomId));
                break;
                
            case "leave":
                activeRooms.computeIfPresent(roomId, (k, v) -> v > 1 ? v - 1 : null);
                System.out.println("👋 User left");
                break;
        }
        
        message.setTimestamp(System.currentTimeMillis());
        return message;
    }
}