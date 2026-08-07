package com.donation.service;

import com.donation.dto.CreateDonationRequest;
import com.donation.dto.DonationResponse;
import com.donation.entity.Donation;
import com.donation.entity.DonationStatus;
import com.donation.entity.User;
import com.donation.repository.DonationRepository;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationResponse createDonation(Long donorId, CreateDonationRequest request) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new IllegalArgumentException("Donor not found"));

        Donation donation = Donation.builder()
                .donor(donor)
                .category(request.getCategory())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .imageUrl(request.getImageUrl())
                .pickupAddress(request.getPickupAddress())
                .status(DonationStatus.AVAILABLE)
                .build();

        donation = donationRepository.save(donation);
        return toResponse(donation);
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

        // Ownership check - a donor can only cancel their own donation
        if (!donation.getDonor().getId().equals(donorId)) {
            throw new IllegalArgumentException("You do not own this donation");
        }

        if (donation.getStatus() == DonationStatus.DELIVERED) {
            throw new IllegalArgumentException("Cannot cancel a donation that has already been delivered");
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);
    }

    private DonationResponse toResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getId())
                .donorId(donation.getDonor().getId())
                .donorName(donation.getDonor().getName())
                .category(donation.getCategory())
                .description(donation.getDescription())
                .quantity(donation.getQuantity())
                .imageUrl(donation.getImageUrl())
                .pickupAddress(donation.getPickupAddress())
                .status(donation.getStatus())
                .createdAt(donation.getCreatedAt())
                .build();
    }
}
