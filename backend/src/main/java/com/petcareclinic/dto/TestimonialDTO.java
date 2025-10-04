package com.petcareclinic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialDTO {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerImageUrl;
    private Integer rating;
    private String title;
    private String content;
    private String petName;
    private String petType;
    private String serviceType;
    private Boolean isApproved;
    private Boolean isFeatured;
    private LocalDateTime approvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
