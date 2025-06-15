package com.petcareclinic.model;
import jakarta.persistence.*; // For Spring Boot 3.x+ (Java 17/21+)

import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String role; // e.g., ROLE_USER, ROLE_ADMIN
}