package com.donation.repository;

import com.donation.entity.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRequestRepository extends JpaRepository<DonationRequest, Long> {

    List<DonationRequest> findByDonationId(Long donationId);

    List<DonationRequest> findByOrphanageId(Long orphanageId);
}
