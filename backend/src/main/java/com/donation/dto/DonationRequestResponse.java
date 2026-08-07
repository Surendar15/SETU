package com.donation.dto;

import com.donation.entity.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRequestResponse {

    private Long id;
    private Long donationId;
    private String donationDescription;
    private Long orphanageId;
    private String orphanageName;
    private RequestStatus status;
    private LocalDateTime requestedAt;
}
