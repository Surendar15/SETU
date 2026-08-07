package com.donation.dto;

import com.donation.entity.DonationCategory;
import com.donation.entity.DonationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationResponse {

    private Long id;
    private Long donorId;
    private String donorName;
    private DonationCategory category;
    private String description;
    private String quantity;
    private String imageUrl;
    private String pickupAddress;
    private DonationStatus status;
    private LocalDateTime createdAt;
}
