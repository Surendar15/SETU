package com.donation.service;

import com.donation.dto.AuthResponse;
import com.donation.dto.LoginRequest;
import com.donation.dto.RegisterRequest;
import com.donation.entity.*;
import com.donation.repository.OrphanageDetailsRepository;
import com.donation.repository.UserRepository;
import com.donation.repository.VolunteerDetailsRepository;
import com.donation.security.CustomUserDetails;
import com.donation.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrphanageDetailsRepository orphanageDetailsRepository;
    private final VolunteerDetailsRepository volunteerDetailsRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (!otpService.isRecentlyVerified(request.getEmail())) {
            throw new IllegalArgumentException("Please verify your email with OTP before registering");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // never store plain text
                .phone(request.getPhone())
                .role(request.getRole())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .isVerified(false)
                .build();

        user = userRepository.save(user);

        // Create the role-specific extension row based on chosen role
        if (request.getRole() == Role.ORPHANAGE) {
            OrphanageDetails details = OrphanageDetails.builder()
                    .user(user)
                    .registrationNumber(request.getRegistrationNumber())
                    .capacity(request.getCapacity())
                    .build();
            orphanageDetailsRepository.save(details);
        } else if (request.getRole() == Role.VOLUNTEER) {
            VolunteerDetails details = VolunteerDetails.builder()
                    .user(user)
                    .vehicleType(request.getVehicleType())
                    .availability(true)
                    .totalDeliveries(0)
                    .build();
            volunteerDetailsRepository.save(details);
        }
        // DONOR role has no extension table - the base User row is enough

        String token = jwtUtil.generateToken(new CustomUserDetails(user));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getEmail().trim();
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByPhone(identifier))
                .or(() -> {
                    String withPrefix = identifier.startsWith("+91") ? identifier : "+91 " + identifier;
                    String withoutPrefix = identifier.replace("+91", "").trim();
                    return userRepository.findByPhone(withPrefix)
                            .or(() -> userRepository.findByPhone(withoutPrefix));
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found with provided email or mobile number"));

        // Authenticate with the user's primary email or resolved principal
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(new CustomUserDetails(user));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public void resetPassword(com.donation.dto.ResetPasswordRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + request.getEmail()));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
