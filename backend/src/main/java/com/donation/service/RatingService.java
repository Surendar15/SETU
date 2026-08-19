package com.donation.service;

import com.donation.dto.CreateRatingRequest;
import com.donation.dto.RatingResponse;
import com.donation.dto.RatingSummaryResponse;
import com.donation.entity.Delivery;
import com.donation.entity.DeliveryStatus;
import com.donation.entity.Rating;
import com.donation.entity.User;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final DeliveryRepository deliveryRepository;

    public RatingResponse submitRating(Long orphanageId, CreateRatingRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (!delivery.getOrphanage().getId().equals(orphanageId)) {
            throw new IllegalArgumentException("You can only rate deliveries made to you");
        }

        if (delivery.getStatus() != DeliveryStatus.DELIVERED) {
            throw new IllegalArgumentException("You can only rate a delivery after it's been delivered");
        }

        User ratee = switch (request.getRateeRole()) {
            case DONOR -> delivery.getDonation().getDonor();
            case VOLUNTEER -> {
                if (delivery.getVolunteer() == null) {
                    throw new IllegalArgumentException("No volunteer is assigned to this delivery");
                }
                yield delivery.getVolunteer();
            }
        };

        if (ratingRepository.existsByDeliveryIdAndRateeId(delivery.getId(), ratee.getId())) {
            throw new IllegalArgumentException("You've already rated this person for this delivery");
        }

        Rating rating = Rating.builder()
                .delivery(delivery)
                .rater(delivery.getOrphanage())
                .ratee(ratee)
                .stars(request.getStars())
                .comment(request.getComment())
                .build();
        rating = ratingRepository.save(rating);

        return toResponse(rating);
    }

    public List<RatingResponse> getRatingsForDelivery(Long deliveryId) {
        return ratingRepository.findByDeliveryId(deliveryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RatingResponse> getRatingsForUser(Long userId) {
        return ratingRepository.findByRateeId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RatingSummaryResponse getRatingSummary(Long userId) {
        List<Rating> ratings = ratingRepository.findByRateeId(userId);

        double average = ratings.stream()
                .mapToInt(Rating::getStars)
                .average()
                .orElse(0.0);

        return RatingSummaryResponse.builder()
                .userId(userId)
                .averageStars(Math.round(average * 10) / 10.0)
                .totalRatings(ratings.size())
                .build();
    }

    private RatingResponse toResponse(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .deliveryId(rating.getDelivery().getId())
                .donationId(rating.getDelivery().getDonation().getId())
                .raterId(rating.getRater().getId())
                .raterName(rating.getRater().getName())
                .rateeId(rating.getRatee().getId())
                .rateeName(rating.getRatee().getName())
                .stars(rating.getStars())
                .comment(rating.getComment())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
