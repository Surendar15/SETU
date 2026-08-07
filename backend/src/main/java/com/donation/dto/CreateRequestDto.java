package com.donation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateRequestDto {

    @NotNull
    private Long donationId;
}
