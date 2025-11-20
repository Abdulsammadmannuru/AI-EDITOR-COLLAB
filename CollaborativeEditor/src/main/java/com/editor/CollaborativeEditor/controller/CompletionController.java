package com.editor.CollaborativeEditor.controller;



import com.editor.CollaborativeEditor.model.CompletionRequest;
import com.editor.CollaborativeEditor.model.CompletionResponse;
import com.editor.CollaborativeEditor.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CompletionController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/complete")
    public ResponseEntity<List<CompletionResponse>> getCompletion(@RequestBody CompletionRequest request) {
        
        System.out.println("===========================================");
        System.out.println("📥 Completion request received");
        System.out.println("Language: " + request.getLanguage());
        System.out.println("Cursor position: " + request.getCursorPosition());
        System.out.println("===========================================");
        
        try {
            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                System.err.println("❌ Invalid request: Empty code");
                return ResponseEntity.badRequest().build();
            }
            
            List<CompletionResponse> completions = geminiService.getCodeCompletion(request);
            
            System.out.println("✅ Generated " + completions.size() + " completion(s)");
            System.out.println("===========================================\n");
            
            return ResponseEntity.ok(completions);
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Backend is running! ✅");
    }
}