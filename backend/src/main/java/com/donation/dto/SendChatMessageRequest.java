package com.donation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendChatMessageRequest {

    @NotNull
    private Long deliveryId;

    @NotBlank
    private String content;
}
