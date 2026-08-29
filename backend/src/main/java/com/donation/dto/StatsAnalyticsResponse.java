package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatsAnalyticsResponse {

    private Map<String, Long> categoryCounts;
    private long urgentDonationsCount;
    private double deliveryCompletionRate;
    private long totalAvailableDonations;
}
