package com.securecode.analyzer.model;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Severity {
    CRITICAL(4),
    HIGH(3),
    MEDIUM(2),
    LOW(1);

    private final int weight;

    Severity(int weight) {
        this.weight = weight;
    }

    public int getWeight() {
        return weight;
    }

    @JsonValue
    public String toJson() {
        return this.name();
    }
}
