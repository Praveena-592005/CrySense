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
            String url = "http://localhost:5000/predict";
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(filePath));
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            return restTemplate.postForObject(url, requestEntity, String.class);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            return e.getResponseBodyAsString();
        } catch (Exception e) {
            return "{\"error\": \"Service unreachable\"}";
        }
    }
}