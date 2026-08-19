package com.donation.service;

import com.donation.dto.ImpactStatsResponse;
import com.donation.entity.DeliveryStatus;
import com.donation.entity.DonationStatus;
import com.donation.entity.Role;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.DonationRepository;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final DeliveryRepository deliveryRepository;

    public ImpactStatsResponse getImpactStats() {
        long activeDeliveries = deliveryRepository.countByStatusIn(
                List.of(DeliveryStatus.PENDING_PICKUP, DeliveryStatus.PICKED_UP, DeliveryStatus.IN_TRANSIT)
        );

        return ImpactStatsResponse.builder()
                .totalDonationsPosted(donationRepository.count())
                .totalDonationsDelivered(donationRepository.countByStatus(DonationStatus.DELIVERED))
                .totalDonorsCount(userRepository.countByRole(Role.DONOR))
                .totalVolunteersCount(userRepository.countByRole(Role.VOLUNTEER))
                .totalOrphanagesCount(userRepository.countByRole(Role.ORPHANAGE))
                .activeDeliveriesCount(activeDeliveries)
                .build();
    }
}
