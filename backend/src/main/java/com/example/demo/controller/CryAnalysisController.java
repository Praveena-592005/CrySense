package com.example.demo.controller;

import com.example.demo.model.Prediction;
import com.example.demo.repository.PredictionRepository;
import com.example.demo.service.CryAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CryAnalysisController {

    @Autowired
    private CryAnalysisService cryAnalysisService;

    @Autowired
    private PredictionRepository predictionRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeCry(@RequestParam("file") MultipartFile file) {
        try {
            File tempFile = File.createTempFile("temp", ".wav");
            file.transferTo(tempFile);
            
            String jsonResponse = cryAnalysisService.callPythonModel(tempFile.getAbsolutePath());
            
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            
            if (root.has("prediction") && root.has("confidence")) {
                String cryType = root.get("prediction").asText();
                double confidence = root.get("confidence").asDouble(); 
                
                Prediction p = new Prediction();
                p.setCryType(cryType);
                p.setConfidence(confidence); 
                predictionRepository.save(p);
                
                tempFile.delete();
               
                return ResponseEntity.ok(jsonResponse);
            } else {
                tempFile.delete();
                return ResponseEntity.status(500).body("ML Service Error: " + jsonResponse);
            }
            
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Backend Error: " + e.getMessage());
        }
    }
}