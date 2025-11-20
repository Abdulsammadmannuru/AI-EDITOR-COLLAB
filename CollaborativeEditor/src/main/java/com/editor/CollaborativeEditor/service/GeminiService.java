package com.editor.CollaborativeEditor.service;


import com.editor.CollaborativeEditor.model.CompletionRequest;
import com.editor.CollaborativeEditor.model.CompletionResponse;
//
//import com.editor.model.CompletionRequest;
//import com.editor.model.CompletionResponse;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final OkHttpClient httpClient;
    private final Gson gson;

    public GeminiService() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    public List<CompletionResponse> getCodeCompletion(CompletionRequest request) {
        List<CompletionResponse> responses = new ArrayList<>();

        try {
            String prompt = buildPrompt(request);
            String requestBody = buildGeminiRequestBody(prompt);
            String responseBody = callGeminiApi(requestBody);
            responses = parseGeminiResponse(responseBody);
            
        } catch (IOException e) {
            System.err.println("IOException: " + e.getMessage());
            return createFallbackResponse("Network error");
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            return createFallbackResponse("Processing error");
        }

        return responses;
    }

    private String buildPrompt(CompletionRequest request) {
        String code = request.getCode();
        String language = request.getLanguage() != null ? request.getLanguage() : "javascript";
        int cursorPos = Math.min(request.getCursorPosition(), code.length());

        String beforeCursor = code.substring(0, cursorPos);
        String afterCursor = cursorPos < code.length() ? code.substring(cursorPos) : "";

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert ").append(language).append(" code completion assistant.\n\n");
        prompt.append("Complete the code at the cursor position.\n\n");
        prompt.append("CODE BEFORE CURSOR:\n```").append(language).append("\n");
        prompt.append(beforeCursor).append("\n```\n\n");
        
        if (!afterCursor.trim().isEmpty()) {
            prompt.append("CODE AFTER CURSOR:\n```").append(language).append("\n");
            prompt.append(afterCursor).append("\n```\n\n");
        }
        
        prompt.append("REQUIREMENTS:\n");
        prompt.append("1. Provide ONLY the code to insert at cursor\n");
        prompt.append("2. Do NOT repeat existing code\n");
        prompt.append("3. No explanations or markdown\n");
        prompt.append("4. Max 5 lines\n\n");
        prompt.append("COMPLETION:");

        return prompt.toString();
    }

    private String buildGeminiRequestBody(String prompt) {
        JsonObject requestJson = new JsonObject();
        
        JsonArray contentsArray = new JsonArray();
        JsonObject contentObject = new JsonObject();
        JsonArray partsArray = new JsonArray();
        JsonObject partObject = new JsonObject();
        
        partObject.addProperty("text", prompt);
        partsArray.add(partObject);
        contentObject.add("parts", partsArray);
        contentsArray.add(contentObject);
        requestJson.add("contents", contentsArray);
        
        JsonObject generationConfig = new JsonObject();
        generationConfig.addProperty("temperature", 0.7);
        generationConfig.addProperty("maxOutputTokens", 256);
        generationConfig.addProperty("topP", 0.8);
        generationConfig.addProperty("topK", 40);
        requestJson.add("generationConfig", generationConfig);

        return gson.toJson(requestJson);
    }

    private String callGeminiApi(String requestBody) throws IOException {
        String urlWithKey = apiUrl + "?key=" + apiKey;

        RequestBody body = RequestBody.create(
            requestBody,
            MediaType.parse("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .url(urlWithKey)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No details";
                throw new IOException("Gemini API error " + response.code() + ": " + errorBody);
            }
            return response.body().string();
        }
    }

    private List<CompletionResponse> parseGeminiResponse(String responseBody) {
        List<CompletionResponse> responses = new ArrayList<>();

        try {
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
            
            if (!jsonResponse.has("candidates")) {
                return createFallbackResponse("No candidates");
            }
            
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            
            for (int i = 0; i < candidates.size(); i++) {
                JsonObject candidate = candidates.get(i).getAsJsonObject();
                
                if (!candidate.has("content")) continue;
                JsonObject content = candidate.getAsJsonObject("content");
                
                if (!content.has("parts")) continue;
                JsonArray parts = content.getAsJsonArray("parts");
                
                for (int j = 0; j < parts.size(); j++) {
                    JsonObject part = parts.get(j).getAsJsonObject();
                    
                    if (part.has("text")) {
                        String suggestionText = part.get("text").getAsString();
                        String cleaned = cleanSuggestion(suggestionText);
                        
                        if (!cleaned.isEmpty()) {
                            responses.add(new CompletionResponse(
                                cleaned,
                                "AI completion",
                                85,
                                "gemini-pro"
                            ));
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Parse error: " + e.getMessage());
        }

        if (responses.isEmpty()) {
            return createFallbackResponse("No suggestions");
        }

        return responses;
    }

    private String cleanSuggestion(String suggestion) {
        if (suggestion == null) return "";
        
        suggestion = suggestion.replaceAll("```[a-zA-Z]*\\n?", "");
        suggestion = suggestion.replaceAll("```", "");
        suggestion = suggestion.replaceFirst("^COMPLETION:\\s*", "");
        suggestion = suggestion.trim();
        
        return suggestion;
    }

    private List<CompletionResponse> createFallbackResponse(String message) {
        List<CompletionResponse> responses = new ArrayList<>();
        responses.add(new CompletionResponse(
            "// " + message,
            "Fallback",
            0,
            "fallback"
        ));
        return responses;
    }
}