package com.donation.controller;

import com.donation.dto.ImpactStatsResponse;
import com.donation.dto.LeaderboardResponse;
import com.donation.dto.StatsAnalyticsResponse;
import com.donation.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/impact")
    public ResponseEntity<ImpactStatsResponse> getImpactStats() {
        return ResponseEntity.ok(statsService.getImpactStats());
    }

    @GetMapping("/analytics")
    public ResponseEntity<StatsAnalyticsResponse> getAnalyticsStats() {
        return ResponseEntity.ok(statsService.getAnalyticsStats());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<LeaderboardResponse> getLeaderboardStats() {
        return ResponseEntity.ok(statsService.getLeaderboardStats());
    }
}
