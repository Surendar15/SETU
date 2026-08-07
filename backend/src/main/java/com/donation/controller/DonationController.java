package com.donation.controller;

import com.donation.dto.CreateDonationRequest;
import com.donation.dto.DonationResponse;
import com.donation.security.CustomUserDetails;
import com.donation.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    // Only donors can post a donation
    @PreAuthorize("hasRole('DONOR')")
    @PostMapping
    public ResponseEntity<DonationResponse> createDonation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody CreateDonationRequest request
    ) {
        return ResponseEntity.ok(donationService.createDonation(currentUser.getId(), request));
    }

    // Any authenticated user (orphanages mainly, but donors/volunteers can browse too) can see open donations
    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAvailableDonations() {
        return ResponseEntity.ok(donationService.getAvailableDonations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonation(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    // A donor viewing their own posted donations, regardless of status
    @PreAuthorize("hasRole('DONOR')")
    @GetMapping("/my")
    public ResponseEntity<List<DonationResponse>> getMyDonations(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(donationService.getMyDonations(currentUser.getId()));
    }

    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelDonation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id
    ) {
        donationService.cancelDonation(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}
