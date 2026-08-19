package com.donation.repository;

import com.donation.entity.Donation;
import com.donation.entity.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByDonorId(Long donorId);

    long countByStatus(DonationStatus status);
}
