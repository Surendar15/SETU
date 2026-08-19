package com.donation.service;

import com.donation.dto.DeliveryResponse;
import com.donation.entity.*;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.DonationRepository;
import com.donation.repository.UserRepository;
import com.donation.repository.VolunteerDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final VolunteerDetailsRepository volunteerDetailsRepository;
    private final NotificationService notificationService;

    public List<DeliveryResponse> getOpenDeliveries() {
        return deliveryRepository.findByVolunteerIsNull()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryResponse> getMyDeliveries(Long volunteerId) {
        return deliveryRepository.findByVolunteerId(volunteerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<DeliveryResponse> getDeliveriesForOrphanage(Long orphanageId) {
        return deliveryRepository.findByOrphanageId(orphanageId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DeliveryResponse acceptDelivery(Long volunteerId, Long deliveryId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (delivery.getVolunteer() != null) {
            throw new IllegalArgumentException("This delivery has already been claimed by another volunteer");
        }

        User volunteer = userRepository.findById(volunteerId)
                .orElseThrow(() -> new IllegalArgumentException("Volunteer not found"));

        delivery.setVolunteer(volunteer);
        deliveryRepository.save(delivery);

        notificationService.notifyUser(
                delivery.getOrphanage().getEmail(),
                volunteer.getName() + " will deliver your donation: " + delivery.getDonation().getDescription()
        );
        notificationService.notifyUser(
                delivery.getDonation().getDonor().getEmail(),
                volunteer.getName() + " picked up your donation for delivery: " + delivery.getDonation().getDescription()
        );

        return toResponse(delivery);
    }

    public DeliveryResponse updateStatus(Long volunteerId, Long deliveryId, DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        if (delivery.getVolunteer() == null || !delivery.getVolunteer().getId().equals(volunteerId)) {
            throw new IllegalArgumentException("You are not assigned to this delivery");
        }

        validateStatusTransition(delivery.getStatus(), newStatus);

        delivery.setStatus(newStatus);
        Donation donation = delivery.getDonation();

        if (newStatus == DeliveryStatus.PICKED_UP) {
            delivery.setPickupTime(LocalDateTime.now());
            donation.setStatus(DonationStatus.PICKED_UP);
        } else if (newStatus == DeliveryStatus.IN_TRANSIT) {
            donation.setStatus(DonationStatus.IN_TRANSIT);
        } else if (newStatus == DeliveryStatus.DELIVERED) {
            delivery.setDeliveryTime(LocalDateTime.now());
            donation.setStatus(DonationStatus.DELIVERED);

            volunteerDetailsRepository.findById(volunteerId).ifPresent(details -> {
                details.setTotalDeliveries(details.getTotalDeliveries() + 1);
                volunteerDetailsRepository.save(details);
            });
        }

        donationRepository.save(donation);
        deliveryRepository.save(delivery);

        notificationService.notifyUser(
                delivery.getOrphanage().getEmail(),
                "Delivery update: \"" + donation.getDescription() + "\" is now " + newStatus.name().replace("_", " ")
        );
        notificationService.notifyUser(
                donation.getDonor().getEmail(),
                "Delivery update: \"" + donation.getDescription() + "\" is now " + newStatus.name().replace("_", " ")
        );

        return toResponse(delivery);
    }

    private void validateStatusTransition(DeliveryStatus current, DeliveryStatus next) {
        boolean valid = switch (current) {
            case PENDING_PICKUP -> next == DeliveryStatus.PICKED_UP;
            case PICKED_UP -> next == DeliveryStatus.IN_TRANSIT;
            case IN_TRANSIT -> next == DeliveryStatus.DELIVERED;
            case DELIVERED -> false;
        };

        if (!valid) {
            throw new IllegalArgumentException(
                    "Cannot move delivery from " + current + " to " + next);
        }
    }

    private DeliveryResponse toResponse(Delivery delivery) {
        return DeliveryResponse.builder()
                .id(delivery.getId())
                .donationId(delivery.getDonation().getId())
                .donationDescription(delivery.getDonation().getDescription())
                .pickupAddress(delivery.getDonation().getPickupAddress())
                .latitude(delivery.getDonation().getLatitude())
                .longitude(delivery.getDonation().getLongitude())
                .donorId(delivery.getDonation().getDonor().getId())
                .donorName(delivery.getDonation().getDonor().getName())
                .volunteerId(delivery.getVolunteer() != null ? delivery.getVolunteer().getId() : null)
                .volunteerName(delivery.getVolunteer() != null ? delivery.getVolunteer().getName() : null)
                .orphanageId(delivery.getOrphanage().getId())
                .orphanageName(delivery.getOrphanage().getName())
                .status(delivery.getStatus())
                .pickupTime(delivery.getPickupTime())
                .deliveryTime(delivery.getDeliveryTime())
                .build();
    }
}