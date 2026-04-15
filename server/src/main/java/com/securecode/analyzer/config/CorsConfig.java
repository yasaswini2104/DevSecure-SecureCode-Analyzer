package com.securecode.analyzer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // allow all endpoints
                .allowedOrigins("*") // allow all origins (for now)
                .allowedMethods("*") // allow ALL methods (IMPORTANT)
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}