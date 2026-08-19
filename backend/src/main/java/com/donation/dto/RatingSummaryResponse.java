package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingSummaryResponse {

    private Long userId;
    private double averageStars;
    private long totalRatings;
}
