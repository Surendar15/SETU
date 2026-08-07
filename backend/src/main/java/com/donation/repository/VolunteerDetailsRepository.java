package com.donation.repository;

import com.donation.entity.VolunteerDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VolunteerDetailsRepository extends JpaRepository<VolunteerDetails, Long> {

    List<VolunteerDetails> findByAvailabilityTrue();
}
