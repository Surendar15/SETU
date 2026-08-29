package com.donation.service;

import com.donation.dto.CreateDonationRequest;
import com.donation.dto.DonationResponse;
import com.donation.entity.Donation;
import com.donation.entity.DonationRequest;
import com.donation.entity.DonationStatus;
import com.donation.entity.RequestStatus;
import com.donation.entity.User;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.DonationRepository;
import com.donation.repository.DonationRequestRepository;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final GeocodingService geocodingService;
    private final DeliveryRepository deliveryRepository;
    private final DonationRequestRepository donationRequestRepository;

    public DonationResponse createDonation(Long donorId, CreateDonationRequest request) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));

        Boolean isUrgent = Boolean.TRUE.equals(request.getIsUrgent());
        java.time.LocalDateTime expiresAt = null;
        if (request.getExpiryHours() != null && request.getExpiryHours() > 0) {
            expiresAt = java.time.LocalDateTime.now().plusHours(request.getExpiryHours());
        }

        Donation donation = Donation.builder()
                .donor(donor)
                .category(request.getCategory())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .imageUrl(request.getImageUrl())
                .pickupAddress(request.getPickupAddress())
                .isUrgent(isUrgent)
                .expiresAt(expiresAt)
                .status(DonationStatus.AVAILABLE)
                .build();

        Optional<GeocodingService.Coordinates> coords = geocodingService.geocode(request.getPickupAddress());
        if (coords.isPresent()) {
            donation.setLatitude(coords.get().latitude());
            donation.setLongitude(coords.get().longitude());
        }

        Donation savedDonation = donationRepository.save(donation);

        notificationService.broadcast(
                "new-donations",
                donor.getName() + " posted a new donation: " + savedDonation.getDescription()
        );

        return toResponse(savedDonation);
    }

    public List<DonationResponse> getAvailableDonations() {
        return donationRepository.findByStatus(DonationStatus.AVAILABLE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DonationResponse> getMyDonations(Long donorId) {
        return donationRepository.findByDonorId(donorId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DonationResponse getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));
        return toResponse(donation);
    }

    public void cancelDonation(Long donorId, Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));

        if (!donation.getDonor().getId().equals(donorId)) {
            throw new IllegalArgumentException("You do not own this donation");
        }

        if (donation.getStatus() == DonationStatus.DELIVERED) {
            throw new IllegalArgumentException("Cannot cancel a donation that has already been delivered");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);

        // Any orphanage with a still-pending request on this donation needs to
        // see it as cancelled too, not left hanging as "PENDING" forever.
        List<DonationRequest> pendingRequests = donationRequestRepository.findByDonationId(donationId)
                .stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING)
                .toList();

        for (DonationRequest request : pendingRequests) {
            request.setStatus(RequestStatus.CANCELLED);
            donationRequestRepository.save(request);

            notificationService.notifyUser(
                    request.getOrphanage().getEmail(),
                    "The donation \"" + donation.getDescription() + "\" you requested was cancelled by the donor."
            );
        }
    }

    private DonationResponse toResponse(Donation donation) {
        Long deliveryId = deliveryRepository.findByDonationId(donation.getId())
                .map(d -> d.getId())
                .orElse(null);

        return DonationResponse.builder()
                .id(donation.getId())
                .donorId(donation.getDonor().getId())
                .donorName(donation.getDonor().getName())
                .category(donation.getCategory())
                .description(donation.getDescription())
                .quantity(donation.getQuantity())
                .imageUrl(donation.getImageUrl())
                .pickupAddress(donation.getPickupAddress())
                .latitude(donation.getLatitude())
                .longitude(donation.getLongitude())
                .status(donation.getStatus())
                .isUrgent(donation.getIsUrgent())
                .expiresAt(donation.getExpiresAt())
                .createdAt(donation.getCreatedAt())
                .deliveryId(deliveryId)
                .build();
    }
}