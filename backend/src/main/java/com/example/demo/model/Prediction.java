package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String cryType;
    private Double confidence;
    private LocalDateTime timestamp = LocalDateTime.now();

    public void setCryType(String cryType) { this.cryType = cryType; }
    public String getCryType() { return cryType; }

    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Double getConfidence() { return confidence; }
}