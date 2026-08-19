package com.donation.controller;

import com.donation.dto.ChatMessageResponse;
import com.donation.dto.SendChatMessageRequest;
import com.donation.security.CustomUserDetails;
import com.donation.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody SendChatMessageRequest request
    ) {
        return ResponseEntity.ok(chatService.sendMessage(currentUser.getId(), request));
    }

    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long deliveryId
    ) {
        return ResponseEntity.ok(chatService.getMessagesForDelivery(deliveryId, currentUser.getId()));
    }
}
