package com.editor.CollaborativeEditor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CollaborativeEditorApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollaborativeEditorApplication.class, args);
		  
        System.out.println("\n=================================================");
        System.out.println("🚀 Collaborative Code Editor Backend Started!");
        System.out.println("=================================================");
        System.out.println("📡 WebSocket: ws://localhost:8080/ws");
        System.out.println("🔗 REST API: http://localhost:8080/api");
        System.out.println("💚 Health: http://localhost:8080/api/health");
        System.out.println("=================================================\n");
    
	}

}
