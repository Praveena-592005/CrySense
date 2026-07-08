package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@Service
public class CryAnalysisService {
   public String callPythonModel(String filePath) {
    try {
        RestTemplate restTemplate = new RestTemplate();
        String baseUrl = System.getenv("ML_SERVICE_URL");
        if (baseUrl == null || baseUrl.isEmpty()) baseUrl = "http://localhost:5000";
        String url = baseUrl + "/predict";
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(filePath));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        
        String response = restTemplate.postForObject(url, requestEntity, String.class);
        
        // ADD THIS CHECK:
        if (response != null && response.trim().startsWith("<")) {
            return "{\"error\": \"ML Service returned HTML instead of JSON\"}";
        }
        return response;
        
    } catch (Exception e) {
        return "{\"error\": \"Service unreachable: " + e.getMessage() + "\"}";
    }
  }
}