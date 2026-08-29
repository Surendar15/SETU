package com.donation.service;

import com.donation.dto.ImpactStatsResponse;
import com.donation.dto.LeaderboardResponse;
import com.donation.dto.StatsAnalyticsResponse;
import com.donation.entity.*;
import com.donation.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final DeliveryRepository deliveryRepository;
    private final RatingRepository ratingRepository;
    private final VolunteerDetailsRepository volunteerDetailsRepository;

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

    public StatsAnalyticsResponse getAnalyticsStats() {
        List<Donation> allDonations = donationRepository.findAll();

        Map<String, Long> categoryCounts = new LinkedHashMap<>();
        for (DonationCategory category : DonationCategory.values()) {
            categoryCounts.put(category.name(), 0L);
        }
        for (Donation donation : allDonations) {
            if (donation.getCategory() != null) {
                String catName = donation.getCategory().name();
                categoryCounts.put(catName, categoryCounts.getOrDefault(catName, 0L) + 1);
            }
        }

        long totalPosted = allDonations.size();
        long delivered = donationRepository.countByStatus(DonationStatus.DELIVERED);
        long urgentCount = donationRepository.countByIsUrgentTrue();
        long availableCount = donationRepository.countByStatus(DonationStatus.AVAILABLE);

        double completionRate = totalPosted > 0 ? (double) delivered / totalPosted * 100.0 : 100.0;
        completionRate = Math.round(completionRate * 10.0) / 10.0;

        return StatsAnalyticsResponse.builder()
                .categoryCounts(categoryCounts)
                .urgentDonationsCount(urgentCount)
                .deliveryCompletionRate(completionRate)
                .totalAvailableDonations(availableCount)
                .build();
    }

    public LeaderboardResponse getLeaderboardStats() {
        List<User> donors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.DONOR)
                .toList();

        List<LeaderboardResponse.DonorLeaderboardItem> topDonors = donors.stream()
                .map(donor -> {
                    long count = donationRepository.findByDonorId(donor.getId()).size();
                    List<Rating> ratings = ratingRepository.findByRateeId(donor.getId());
                    double avgRating = ratings.isEmpty() ? 5.0 :
                            ratings.stream().mapToInt(Rating::getStars).average().orElse(5.0);
                    avgRating = Math.round(avgRating * 10.0) / 10.0;

                    return LeaderboardResponse.DonorLeaderboardItem.builder()
                            .id(donor.getId())
                            .name(donor.getName())
                            .donationsCount(count)
                            .averageRating(avgRating)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getDonationsCount(), a.getDonationsCount()))
                .limit(5)
                .toList();

        List<User> volunteers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.VOLUNTEER)
                .toList();

        List<LeaderboardResponse.VolunteerLeaderboardItem> topVolunteers = volunteers.stream()
                .map(v -> {
                    VolunteerDetails details = volunteerDetailsRepository.findById(v.getId()).orElse(null);
                    int deliveries = details != null ? details.getTotalDeliveries() : 0;
                    String vehicle = details != null ? details.getVehicleType() : "Standard";

                    List<Rating> ratings = ratingRepository.findByRateeId(v.getId());
                    double avgRating = ratings.isEmpty() ? 5.0 :
                            ratings.stream().mapToInt(Rating::getStars).average().orElse(5.0);
                    avgRating = Math.round(avgRating * 10.0) / 10.0;

                    return LeaderboardResponse.VolunteerLeaderboardItem.builder()
                            .id(v.getId())
                            .name(v.getName())
                            .totalDeliveries(deliveries)
                            .averageRating(avgRating)
                            .vehicleType(vehicle)
                            .build();
                })
                .sorted((a, b) -> Integer.compare(b.getTotalDeliveries(), a.getTotalDeliveries()))
                .limit(5)
                .toList();

        return LeaderboardResponse.builder()
                .topDonors(topDonors)
                .topVolunteers(topVolunteers)
                .build();
    }
}
