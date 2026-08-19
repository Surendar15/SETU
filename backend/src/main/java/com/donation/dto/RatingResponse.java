package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {

    private Long id;
    private Long deliveryId;
    private Long donationId;
    private Long raterId;
    private String raterName;
    private Long rateeId;
    private String rateeName;
    private Integer stars;
    private String comment;
    private LocalDateTime createdAt;
}
