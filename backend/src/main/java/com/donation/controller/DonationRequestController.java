package com.donation.controller;

import com.donation.dto.CreateRequestDto;
import com.donation.dto.DonationRequestResponse;
import com.donation.security.CustomUserDetails;
import com.donation.service.DonationRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class DonationRequestController {

    private final DonationRequestService donationRequestService;

    // Only orphanages can request a donation
    @PreAuthorize("hasRole('ORPHANAGE')")
    @PostMapping
    public ResponseEntity<DonationRequestResponse> createRequest(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody CreateRequestDto dto
    ) {
        return ResponseEntity.ok(donationRequestService.createRequest(currentUser.getId(), dto));
    }

    // Orphanage views all requests they've made
    @PreAuthorize("hasRole('ORPHANAGE')")
    @GetMapping("/my")
    public ResponseEntity<List<DonationRequestResponse>> getMyRequests(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(donationRequestService.getMyRequests(currentUser.getId()));
    }

    // Donor views the requests made against one of their donations
    @PreAuthorize("hasRole('DONOR')")
    @GetMapping("/donation/{donationId}")
    public ResponseEntity<List<DonationRequestResponse>> getRequestsForDonation(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long donationId
    ) {
        return ResponseEntity.ok(donationRequestService.getRequestsForDonation(currentUser.getId(), donationId));
    }

    // Donor accepts a request -> spawns a Delivery for volunteers to pick up
    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/accept")
    public ResponseEntity<DonationRequestResponse> acceptRequest(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(donationRequestService.acceptRequest(currentUser.getId(), id));
    }

    @PreAuthorize("hasRole('DONOR')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<DonationRequestResponse> rejectRequest(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(donationRequestService.rejectRequest(currentUser.getId(), id));
    }
}
