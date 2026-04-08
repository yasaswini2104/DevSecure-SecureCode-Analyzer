package com.securecode.analyzer.model;

import java.time.Instant;
import java.util.List;

public class ScanResponse {

    private int totalIssues;
    private String status;
    private int securityScore;
    private List<Vulnerability> vulnerabilities;
    private String scannedAt;

    public ScanResponse() {}

    public ScanResponse(List<Vulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
        this.totalIssues = vulnerabilities.size();
        this.status = vulnerabilities.isEmpty() ? "CLEAN" : "VULNERABILITIES_FOUND";
        this.securityScore = computeScore(vulnerabilities);
        this.scannedAt = Instant.now().toString();
    }

    
    //  Score = 100 − penalty, floored at 0.
    
    //  Penalty is calculated as a percentage of a "budget" so that a realistic
    //  number of findings doesn't instantly crater the score to 0.
    
    //    Budget:  CRITICAL=25  HIGH=15  MEDIUM=8  LOW=3
    //    Max realistic budget assumed: 100 points worth of issues
    
    //  This means:
    //    - 1 CRITICAL   → score 75   (was 70 before)
    //    - 2 CRITICAL   → score 50
    //    - 4 CRITICAL   → score 0
    //    - 2 CRIT + 1 HIGH + 2 MED → 50+15+16 = 81 → score 19  (not 0!)
    
    private int computeScore(List<Vulnerability> vulns) {
        int penalty = vulns.stream()
            .mapToInt(v -> {
                if (v.getSeverity() == null) return 3;
                return switch (v.getSeverity()) {
                    case CRITICAL -> 25;
                    case HIGH     -> 15;
                    case MEDIUM   ->  8;
                    case LOW      ->  3;
                };
            })
            .sum();
        return Math.max(0, 100 - penalty);
    }

    public int getTotalIssues() { return totalIssues; }
    public void setTotalIssues(int totalIssues) { this.totalIssues = totalIssues; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getSecurityScore() { return securityScore; }
    public void setSecurityScore(int securityScore) { this.securityScore = securityScore; }

    public List<Vulnerability> getVulnerabilities() { return vulnerabilities; }
    public void setVulnerabilities(List<Vulnerability> vulnerabilities) { this.vulnerabilities = vulnerabilities; }

    public String getScannedAt() { return scannedAt; }
    public void setScannedAt(String scannedAt) { this.scannedAt = scannedAt; }
}