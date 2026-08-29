package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardResponse {

    private List<DonorLeaderboardItem> topDonors;
    private List<VolunteerLeaderboardItem> topVolunteers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DonorLeaderboardItem {
        private Long id;
        private String name;
        private long donationsCount;
        private double averageRating;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VolunteerLeaderboardItem {
        private Long id;
        private String name;
        private int totalDeliveries;
        private double averageRating;
        private String vehicleType;
    }
}
