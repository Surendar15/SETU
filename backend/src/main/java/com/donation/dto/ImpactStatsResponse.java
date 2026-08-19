package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImpactStatsResponse {

    private long totalDonationsPosted;
    private long totalDonationsDelivered;
    private long totalDonorsCount;
    private long totalVolunteersCount;
    private long totalOrphanagesCount;
    private long activeDeliveriesCount; // currently in progress (assigned/picked up/in transit)
}
