package com.securecode.analyzer.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securecode.analyzer.model.Severity;
import com.securecode.analyzer.model.Vulnerability;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.*;

@Service
public class AiScanService {

    private static final Logger log = LoggerFactory.getLogger(AiScanService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_MODEL = "gemini-3-flash-preview";

    private static final String PROMPT = """
        You are a professional secure code analyzer.
        Analyze the provided code and identify security vulnerabilities.
        Return the results as a JSON array of objects.
        
        Each object must have:
        - "type": (e.g., SQL Injection, XSS, Hardcoded Credentials)
        - "lineNumber": (the integer line number)
        - "severity": (one of: CRITICAL, HIGH, MEDIUM, LOW)
        - "description": (concise explanation)
        - "suggestedFix": (code or logic recommendation)

        If no issues are found, return an empty array [].
        Do not include any conversational text or markdown formatting.
        """;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public AiScanService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public List<Vulnerability> analyzeWithAi(String code) {
        try {
            String fullPrompt = PROMPT + "\n\nCode to analyze:\n" + code;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", fullPrompt)))
                    ),
                    "generationConfig", Map.of(
                            "response_mime_type", "application/json"
                    )
            );

            String response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/" + GEMINI_MODEL + ":generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    // Handle 503 specifically for the retry logic
                    .onStatus(status -> status.value() == 503, clientResponse -> 
                            Mono.error(new WebClientResponseException(503, "Service Unavailable", null, null, null)))
                    .bodyToMono(String.class)
                    // RETRY LOGIC: Try 3 times, waiting 2s, 4s, 8s between attempts
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
                            .filter(throwable -> throwable instanceof WebClientResponseException &&
                                    ((WebClientResponseException) throwable).getStatusCode().value() == 503))
                    .block();

            return parseResponse(response);

        } catch (Exception e) {
            log.error("AI Scan failed after retries: {}", e.getMessage());
            return List.of(new Vulnerability(
                    "AI_CONNECTION_ERROR", 0,
                    "The AI service is currently unavailable or overloaded. Please try again in a moment.",
                    "Check network connectivity or Gemini API quota.",
                    Severity.MEDIUM
            ));
        }
    }

    private List<Vulnerability> parseResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            
            // Navigate the Gemini response structure
            JsonNode candidates = root.path("candidates");
            if (candidates.isMissingNode() || candidates.isEmpty()) {
                throw new RuntimeException("Gemini returned an empty response.");
            }

            String content = candidates.get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            log.info("AI returned JSON content: {}", content);
            
            List<Map<String, Object>> rawList = objectMapper.readValue(content, new TypeReference<>() {});

            List<Vulnerability> result = new ArrayList<>();
            for (Map<String, Object> item : rawList) {
                Vulnerability v = new Vulnerability();
                v.setType((String) item.getOrDefault("type", "Unknown Vulnerability"));
                v.setLineNumber(((Number) item.getOrDefault("lineNumber", 0)).intValue());
                v.setDescription((String) item.getOrDefault("description", "No description provided."));
                v.setSuggestedFix((String) item.getOrDefault("suggestedFix", "No fix suggested."));
                
                try {
                    String sevStr = ((String) item.getOrDefault("severity", "MEDIUM")).toUpperCase();
                    v.setSeverity(Severity.valueOf(sevStr));
                } catch (IllegalArgumentException e) {
                    v.setSeverity(Severity.MEDIUM);
                }
                result.add(v);
            }
            return result;

        } catch (Exception e) {
            log.error("Failed to parse AI response into Vulnerability objects", e);
            return List.of(new Vulnerability(
                    "PARSE_ERROR", 0,
                    "AI response format was invalid: " + e.getMessage(),
                    "Review the AI logs and ensure the model is returning valid JSON.",
                    Severity.MEDIUM
            ));
        }
    }
}