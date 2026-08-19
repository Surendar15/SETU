package com.donation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {

    private Long id;
    private Long deliveryId;
    private Long senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private LocalDateTime sentAt;
}
