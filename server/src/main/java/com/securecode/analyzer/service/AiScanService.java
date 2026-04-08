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

import java.util.*;

@Service
public class AiScanService {

    private static final Logger log = LoggerFactory.getLogger(AiScanService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_MODEL = "gemini-3.1-flash-lite-preview";

    private static final String PROMPT = """
        You are a secure code analyzer.

        Analyze the given code and return ONLY a valid JSON array.

        Format:
        [
          {
            "type": "SQL Injection",
            "lineNumber": 1,
            "severity": "HIGH",
            "description": "Explain the issue",
            "suggestedFix": "Explain fix"
          }
        ]

        Severity must be one of: CRITICAL, HIGH, MEDIUM, LOW.
        If no issues found, return: []
        ONLY return JSON. No markdown, no explanation.
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
            String fullPrompt = PROMPT + "\n\n" + code;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", fullPrompt)))
                    )
            );

            String response = webClient.post()
                    .uri("/v1beta/models/" + GEMINI_MODEL + ":generateContent?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Gemini RAW RESPONSE: {}", response);
            return parseResponse(response);

        } catch (Exception e) {
            log.error("Gemini API Error", e);
            return List.of(new Vulnerability(
                    "AI_ERROR", 0,
                    "AI service failed: " + e.getMessage(),
                    "Verify Gemini API key in application.properties and check backend logs.",
                    Severity.MEDIUM
            ));
        }
    }

    private List<Vulnerability> parseResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in Gemini response");
            }

            String content = candidates.get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            content = content.replaceAll("(?s)^```json\\s*", "")
                             .replaceAll("(?s)```\\s*$", "")
                             .trim();

            log.info("Cleaned AI Content: {}", content);

            int start = content.indexOf("[");
            int end   = content.lastIndexOf("]");
            if (start == -1 || end == -1) {
                throw new RuntimeException("No JSON array found in AI response");
            }
            content = content.substring(start, end + 1);

            List<Map<String, Object>> rawList =
                    objectMapper.readValue(content, new TypeReference<>() {});

            List<Vulnerability> result = new ArrayList<>();
            for (Map<String, Object> item : rawList) {
                Vulnerability v = new Vulnerability();
                v.setType((String) item.getOrDefault("type", "Unknown"));
                v.setLineNumber(((Number) item.getOrDefault("lineNumber", 0)).intValue());
                v.setDescription((String) item.getOrDefault("description", ""));
                v.setSuggestedFix((String) item.getOrDefault("suggestedFix", ""));
                try {
                    v.setSeverity(Severity.valueOf(
                            ((String) item.getOrDefault("severity", "MEDIUM")).toUpperCase()));
                } catch (Exception e) {
                    v.setSeverity(Severity.MEDIUM);
                }
                result.add(v);
            }
            return result;

        } catch (Exception e) {
            log.error("Parsing Failed", e);
            return List.of(new Vulnerability(
                    "PARSE_ERROR", 0,
                    "Failed to parse AI response: " + e.getMessage(),
                    "Ensure AI returns valid JSON array.",
                    Severity.MEDIUM
            ));
        }
    }
}