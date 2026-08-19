package com.donation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GeocodingService {

    private final RestTemplate restTemplate;

    public record Coordinates(double latitude, double longitude) {}

    /**
     * Converts a free-text address into lat/lng using OpenStreetMap's free
     * Nominatim geocoding service. No API key needed. Returns empty if the
     * address can't be resolved or the service is unreachable - callers
     * should treat this as optional, not block on it.
     */
    public Optional<Coordinates> geocode(String address) {
        if (address == null || address.isBlank()) {
            return Optional.empty();
        }

        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://nominatim.openstreetmap.org/search")
                    .queryParam("q", address)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .toUriString();

            // Nominatim's usage policy requires a descriptive User-Agent header
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "SetuDonationPlatform/1.0");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> results = restTemplate.exchange(
                    url, org.springframework.http.HttpMethod.GET, entity, List.class
            ).getBody();

            if (results == null || results.isEmpty()) {
                return Optional.empty();
            }

            double lat = Double.parseDouble((String) results.get(0).get("lat"));
            double lon = Double.parseDouble((String) results.get(0).get("lon"));
            return Optional.of(new Coordinates(lat, lon));

        } catch (Exception ex) {
            // Geocoding is a nice-to-have, not critical - never block donation creation on it
            return Optional.empty();
        }
    }
}
