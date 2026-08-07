package com.donation.controller;

import com.donation.dto.DeliveryResponse;
import com.donation.dto.UpdateDeliveryStatusDto;
import com.donation.security.CustomUserDetails;
import com.donation.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    // Volunteers browse deliveries nobody has claimed yet
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/open")
    public ResponseEntity<List<DeliveryResponse>> getOpenDeliveries() {
        return ResponseEntity.ok(deliveryService.getOpenDeliveries());
    }

    // Volunteer's own assigned deliveries (past and present)
    @PreAuthorize("hasRole('VOLUNTEER')")
    @GetMapping("/my")
    public ResponseEntity<List<DeliveryResponse>> getMyDeliveries(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(deliveryService.getMyDeliveries(currentUser.getId()));
    }

    // Orphanage tracking donations coming to them
    @PreAuthorize("hasRole('ORPHANAGE')")
    @GetMapping("/incoming")
    public ResponseEntity<List<DeliveryResponse>> getIncomingDeliveries(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.ok(deliveryService.getDeliveriesForOrphanage(currentUser.getId()));
    }

    // Volunteer claims an open delivery
    @PreAuthorize("hasRole('VOLUNTEER')")
    @PatchMapping("/{id}/accept")
    public ResponseEntity<DeliveryResponse> acceptDelivery(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(deliveryService.acceptDelivery(currentUser.getId(), id));
    }

    // Volunteer moves the delivery through PICKED_UP -> IN_TRANSIT -> DELIVERED
    @PreAuthorize("hasRole('VOLUNTEER')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<DeliveryResponse> updateStatus(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdateDeliveryStatusDto dto
    ) {
        return ResponseEntity.ok(deliveryService.updateStatus(currentUser.getId(), id, dto.getStatus()));
    }
}
