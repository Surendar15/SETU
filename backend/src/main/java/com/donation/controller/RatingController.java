package com.donation.controller;

import com.donation.dto.CreateRatingRequest;
import com.donation.dto.RatingResponse;
import com.donation.dto.RatingSummaryResponse;
import com.donation.security.CustomUserDetails;
import com.donation.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // Only orphanages submit ratings, and only for their own deliveries
    @PreAuthorize("hasRole('ORPHANAGE')")
    @PostMapping
    public ResponseEntity<RatingResponse> submitRating(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        return ResponseEntity.ok(ratingService.submitRating(currentUser.getId(), request));
    }

    // Any authenticated user can see what's already been rated for a delivery
    // (used by the orphanage UI to know which "Rate" buttons to still show)
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<RatingResponse>> getRatingsForDelivery(@PathVariable Long deliveryId) {
        return ResponseEntity.ok(ratingService.getRatingsForDelivery(deliveryId));
    }

    // Public-ish: any authenticated user can view someone's rating history
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingResponse>> getRatingsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingsForUser(userId));
    }

    @GetMapping("/user/{userId}/summary")
    public ResponseEntity<RatingSummaryResponse> getRatingSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getRatingSummary(userId));
    }
}
