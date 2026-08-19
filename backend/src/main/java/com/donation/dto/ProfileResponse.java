package com.donation.dto;

import com.donation.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String address;

    // Orphanage-specific
    private String registrationNumber;
    private Integer capacity;

    // Volunteer-specific
    private String vehicleType;
    private Integer totalDeliveries;

    // Rating (donors + volunteers)
    private Double averageStars;
    private Long totalRatings;
}
