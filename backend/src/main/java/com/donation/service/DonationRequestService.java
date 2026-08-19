package com.donation.service;

import com.donation.dto.CreateRequestDto;
import com.donation.dto.DonationRequestResponse;
import com.donation.entity.*;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.DonationRepository;
import com.donation.repository.DonationRequestRepository;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationRequestService {

    private final DonationRequestRepository donationRequestRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final DeliveryRepository deliveryRepository;
    private final NotificationService notificationService;

    public DonationRequestResponse createRequest(Long orphanageId, CreateRequestDto dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new IllegalArgumentException("This donation is no longer available");
        }

        // If the donor already rejected this same orphanage for this donation,
        // don't let them request it again.
        boolean previouslyRejected = donationRequestRepository.findByDonationId(dto.getDonationId())
                .stream()
                .anyMatch(r -> r.getOrphanage().getId().equals(orphanageId)
                        && r.getStatus() == RequestStatus.REJECTED);

        if (previouslyRejected) {
            throw new IllegalArgumentException("The donor already declined your request for this donation");
        }

        User orphanage = userRepository.findById(orphanageId)
                .orElseThrow(() -> new IllegalArgumentException("Orphanage not found"));

        DonationRequest request = DonationRequest.builder()
                .donation(donation)
                .orphanage(orphanage)
                .status(RequestStatus.PENDING)
                .build();
        request = donationRequestRepository.save(request);

        donation.setStatus(DonationStatus.REQUESTED);
        donationRepository.save(donation);

        notificationService.notifyUser(
                donation.getDonor().getEmail(),
                orphanage.getName() + " requested your donation: " + donation.getDescription()
        );

        return toResponse(request);
    }

    public List<DonationRequestResponse> getRequestsForDonation(Long donorId, Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));

        if (!donation.getDonor().getId().equals(donorId)) {
            throw new IllegalArgumentException("You do not own this donation");
        }

        return donationRequestRepository.findByDonationId(donationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DonationRequestResponse> getMyRequests(Long orphanageId) {
        return donationRequestRepository.findByOrphanageId(orphanageId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DonationRequestResponse acceptRequest(Long donorId, Long requestId) {
        DonationRequest request = donationRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        Donation donation = request.getDonation();
        if (!donation.getDonor().getId().equals(donorId)) {
            throw new IllegalArgumentException("You do not own this donation");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        donationRequestRepository.save(request);

        donation.setStatus(DonationStatus.ASSIGNED);
        donationRepository.save(donation);

        Delivery delivery = Delivery.builder()
                .donation(donation)
                .orphanage(request.getOrphanage())
                .status(DeliveryStatus.PENDING_PICKUP)
                .build();
        deliveryRepository.save(delivery);

        notificationService.notifyUser(
                request.getOrphanage().getEmail(),
                "Your request for \"" + donation.getDescription() + "\" was accepted! A volunteer will be assigned soon."
        );
        notificationService.broadcast(
                "open-deliveries",
                "A new delivery is available: " + donation.getDescription()
        );

        return toResponse(request);
    }

    public DonationRequestResponse rejectRequest(Long donorId, Long requestId) {
        DonationRequest request = donationRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        Donation donation = request.getDonation();
        if (!donation.getDonor().getId().equals(donorId)) {
            throw new IllegalArgumentException("You do not own this donation");
        }

        request.setStatus(RequestStatus.REJECTED);
        donationRequestRepository.save(request);

        // Reopen the donation so OTHER orphanages can still request it -
        // the rejected orphanage specifically is blocked from re-requesting
        // by the check in createRequest above.
        donation.setStatus(DonationStatus.AVAILABLE);
        donationRepository.save(donation);

        notificationService.notifyUser(
                request.getOrphanage().getEmail(),
                "Your request for \"" + donation.getDescription() + "\" was declined by the donor."
        );

        return toResponse(request);
    }

    private DonationRequestResponse toResponse(DonationRequest request) {
        return DonationRequestResponse.builder()
                .id(request.getId())
                .donationId(request.getDonation().getId())
                .donationDescription(request.getDonation().getDescription())
                .orphanageId(request.getOrphanage().getId())
                .orphanageName(request.getOrphanage().getName())
                .status(request.getStatus())
                .requestedAt(request.getRequestedAt())
                .build();
    }
}