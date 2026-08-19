package com.donation.dto;

import com.donation.entity.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryResponse {

    private Long id;
    private Long donationId;
    private String donationDescription;
    private String pickupAddress;
    private Double latitude;
    private Double longitude;
    private Long donorId;
    private String donorName;
    private Long volunteerId;
    private String volunteerName;
    private Long orphanageId;
    private String orphanageName;
    private DeliveryStatus status;
    private LocalDateTime pickupTime;
    private LocalDateTime deliveryTime;
}