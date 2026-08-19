package com.donation.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;
    private String phone;
    private String address;

    // Orphanage-specific
    private String registrationNumber;
    private Integer capacity;

    // Volunteer-specific
    private String vehicleType;
}
