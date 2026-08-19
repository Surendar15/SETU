package com.donation.repository;

import com.donation.entity.Delivery;
import com.donation.entity.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByVolunteerId(Long volunteerId);

    List<Delivery> findByOrphanageId(Long orphanageId);

    List<Delivery> findByStatus(DeliveryStatus status);

    // Useful for volunteers browsing open jobs: deliveries with no volunteer assigned yet
    List<Delivery> findByVolunteerIsNull();

    long countByStatusIn(List<DeliveryStatus> statuses);

    Optional<Delivery> findByDonationId(Long donationId);
}
