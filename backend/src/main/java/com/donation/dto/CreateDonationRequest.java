package com.donation.dto;

import com.donation.entity.DonationCategory;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDonationRequest {

    @NotNull
    private DonationCategory category;

    private String description;

    private String quantity;

    private String imageUrl;

    private String pickupAddress;

    private Boolean isUrgent;

    private Integer expiryHours;
}
