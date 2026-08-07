package com.donation.dto;

import com.donation.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String phone;

    @NotNull
    private Role role; // DONOR, VOLUNTEER, or ORPHANAGE

    private String address;

    private Double latitude;

    private Double longitude;

    // --- Only used when role = ORPHANAGE ---
    private String registrationNumber;
    private Integer capacity;

    // --- Only used when role = VOLUNTEER ---
    private String vehicleType;
}
