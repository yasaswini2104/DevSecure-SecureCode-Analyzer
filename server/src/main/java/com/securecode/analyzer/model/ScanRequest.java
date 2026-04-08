package com.securecode.analyzer.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ScanRequest {

    @NotBlank(message = "Code must not be blank.")
    @Size(max = 50_000, message = "Code must not exceed 50,000 characters.")
    private String code;

    private String language; 

    private boolean useAi = false; 

    public ScanRequest() {}

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public boolean isUseAi() { return useAi; }
    public void setUseAi(boolean useAi) { this.useAi = useAi; }
}
