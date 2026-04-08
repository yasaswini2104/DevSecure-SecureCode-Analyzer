package com.securecode.analyzer.controller;

import com.securecode.analyzer.model.ScanRequest;
import com.securecode.analyzer.model.ScanResponse;
import com.securecode.analyzer.model.Vulnerability;
import com.securecode.analyzer.service.AiScanService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ScanController {

    private static final Logger log = LoggerFactory.getLogger(ScanController.class);

    private final AiScanService aiScanService;

    public ScanController(AiScanService aiScanService) {
        this.aiScanService = aiScanService;
    }

    @PostMapping("/scan")
    public ResponseEntity<ScanResponse> scan(@Valid @RequestBody ScanRequest request) {
        log.info("AI scan requested — {} chars, language={}", 
                 request.getCode().length(), request.getLanguage());

        List<Vulnerability> vulns = aiScanService.analyzeWithAi(request.getCode());

        return ResponseEntity.ok(new ScanResponse(vulns));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("SecureCode Analyzer is running!");
    }
}