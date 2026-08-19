package com.donation.repository;

import com.donation.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRateeId(Long rateeId);

    List<Rating> findByDeliveryId(Long deliveryId);

    boolean existsByDeliveryIdAndRateeId(Long deliveryId, Long rateeId);
}
