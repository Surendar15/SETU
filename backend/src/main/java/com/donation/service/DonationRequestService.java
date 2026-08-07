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

    public DonationRequestResponse createRequest(Long orphanageId, CreateRequestDto dto) {
        Donation donation = donationRepository.findById(dto.getDonationId())
                .orElseThrow(() -> new IllegalArgumentException("Donation not found"));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new IllegalArgumentException("This donation is no longer available");
        }

        User orphanage = userRepository.findById(orphanageId)
                .orElseThrow(() -> new IllegalArgumentException("Orphanage not found"));

        DonationRequest request = DonationRequest.builder()
                .donation(donation)
                .orphanage(orphanage)
                .status(RequestStatus.PENDING)
                .build();
        request = donationRequestRepository.save(request);

        // Mark the donation as having an active request so other orphanages
        // see it's no longer freely available (still not yet ASSIGNED to a volunteer)
        donation.setStatus(DonationStatus.REQUESTED);
        donationRepository.save(donation);

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

    /**
     * Donor accepts a request: the request is marked ACCEPTED, the donation
     * moves to ASSIGNED, and a Delivery row is created (with no volunteer yet -
     * volunteers browse open deliveries and pick one up in the next step).
     */
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

        // Reopen the donation so other orphanages can request it again
        donation.setStatus(DonationStatus.AVAILABLE);
        donationRepository.save(donation);

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
