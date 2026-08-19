package com.donation.service;

import com.donation.dto.ProfileResponse;
import com.donation.dto.UpdateProfileRequest;
import com.donation.entity.OrphanageDetails;
import com.donation.entity.Role;
import com.donation.entity.User;
import com.donation.entity.VolunteerDetails;
import com.donation.repository.OrphanageDetailsRepository;
import com.donation.repository.RatingRepository;
import com.donation.repository.UserRepository;
import com.donation.repository.VolunteerDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrphanageDetailsRepository orphanageDetailsRepository;
    private final VolunteerDetailsRepository volunteerDetailsRepository;
    private final RatingRepository ratingRepository;

    public ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .address(user.getAddress());

        if (user.getRole() == Role.ORPHANAGE) {
            orphanageDetailsRepository.findById(userId).ifPresent(details -> {
                builder.registrationNumber(details.getRegistrationNumber());
                builder.capacity(details.getCapacity());
            });
        } else if (user.getRole() == Role.VOLUNTEER) {
            volunteerDetailsRepository.findById(userId).ifPresent(details -> {
                builder.vehicleType(details.getVehicleType());
                builder.totalDeliveries(details.getTotalDeliveries());
            });
        }

        // Donors and volunteers can be rated; show their aggregate here too
        if (user.getRole() == Role.DONOR || user.getRole() == Role.VOLUNTEER) {
            var ratings = ratingRepository.findByRateeId(userId);
            double average = ratings.stream().mapToInt(r -> r.getStars()).average().orElse(0.0);
            builder.averageStars(Math.round(average * 10) / 10.0);
            builder.totalRatings((long) ratings.size());
        }

        return builder.build();
    }

    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        userRepository.save(user);

        if (user.getRole() == Role.ORPHANAGE) {
            OrphanageDetails details = orphanageDetailsRepository.findById(userId)
                    .orElse(OrphanageDetails.builder().userId(userId).user(user).build());
            if (request.getRegistrationNumber() != null) {
                details.setRegistrationNumber(request.getRegistrationNumber());
            }
            if (request.getCapacity() != null) {
                details.setCapacity(request.getCapacity());
            }
            orphanageDetailsRepository.save(details);
        } else if (user.getRole() == Role.VOLUNTEER) {
            VolunteerDetails details = volunteerDetailsRepository.findById(userId)
                    .orElse(VolunteerDetails.builder().userId(userId).user(user).availability(true).totalDeliveries(0).build());
            if (request.getVehicleType() != null) {
                details.setVehicleType(request.getVehicleType());
            }
            volunteerDetailsRepository.save(details);
        }

        return getProfile(userId);
    }
}
