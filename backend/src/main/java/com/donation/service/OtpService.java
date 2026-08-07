package com.donation.service;

import com.donation.entity.OtpVerification;
import com.donation.repository.OtpVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final RestTemplate restTemplate;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    private static final int OTP_VALIDITY_MINUTES = 5;
    // How long after verification the email stays "trusted" for the register call to complete
    private static final int VERIFIED_TRUST_WINDOW_MINUTES = 15;
    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    public void generateAndSendOtp(String email) {
        String otp = generateSixDigitOtp();

        OtpVerification record = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .verified(false)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES))
                .build();
        otpRepository.save(record);

        sendEmail(email, otp);
    }

    public void verifyOtp(String email, String otp) {
        OtpVerification record = otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new IllegalArgumentException("No OTP was sent to this email"));

        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please request a new one.");
        }

        if (!record.getOtp().equals(otp)) {
            throw new IllegalArgumentException("Incorrect OTP");
        }

        record.setVerified(true);
        otpRepository.save(record);
    }

    /**
     * Called during registration to confirm this email was verified recently.
     * Prevents someone from registering an email they never actually verified.
     */
    public boolean isRecentlyVerified(String email) {
        return otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .filter(OtpVerification::getVerified)
                .filter(r -> r.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(VERIFIED_TRUST_WINDOW_MINUTES)))
                .isPresent();
    }

    private String generateSixDigitOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // always 6 digits
        return String.valueOf(otp);
    }

    /**
     * Sends the OTP via Brevo's HTTPS REST API (port 443) instead of raw SMTP
     * (port 587/465). This avoids networks - like college WiFi - that block
     * outbound SMTP ports but always allow normal HTTPS traffic.
     */
    private void sendEmail(String toEmail, String otp) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", "Donation Platform", "email", senderEmail),
                "to", List.of(Map.of("email", toEmail)),
                "subject", "Your verification code",
                "textContent", "Your OTP for registration is: " + otp
                        + "\n\nThis code expires in " + OTP_VALIDITY_MINUTES + " minutes."
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(BREVO_API_URL, request, String.class);
        } catch (Exception ex) {
            ex.printStackTrace(); // prints the real reason (bad API key, unverified sender, etc.)
            throw new IllegalArgumentException("Failed to send OTP email: " + ex.getMessage());
        }
    }
}

