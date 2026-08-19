package com.donation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRatingRequest {

    @NotNull
    private Long deliveryId;

    @NotNull
    private RateeRole rateeRole; // DONOR or VOLUNTEER - who is being rated

    @NotNull
    @Min(1)
    @Max(5)
    private Integer stars;

    private String comment;

    public enum RateeRole {
        DONOR, VOLUNTEER
    }
}
