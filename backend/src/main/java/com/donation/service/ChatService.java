package com.donation.service;

import com.donation.dto.ChatMessageResponse;
import com.donation.dto.SendChatMessageRequest;
import com.donation.entity.ChatMessage;
import com.donation.entity.Delivery;
import com.donation.entity.User;
import com.donation.repository.ChatMessageRepository;
import com.donation.repository.DeliveryRepository;
import com.donation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatMessageResponse sendMessage(Long senderId, SendChatMessageRequest request) {
        Delivery delivery = deliveryRepository.findById(request.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        assertParticipant(delivery, senderId);

        ChatMessage message = ChatMessage.builder()
                .delivery(delivery)
                .sender(sender)
                .content(request.getContent())
                .build();
        message = chatMessageRepository.save(message);

        ChatMessageResponse response = toResponse(message);

        // Push live to everyone currently viewing this delivery's chat thread
        messagingTemplate.convertAndSend("/topic/chat/" + delivery.getId(), response);

        return response;
    }

    public List<ChatMessageResponse> getMessagesForDelivery(Long deliveryId, Long requesterId) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        assertParticipant(delivery, requesterId);

        return chatMessageRepository.findByDeliveryIdOrderBySentAtAsc(deliveryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Only the three people directly involved in this delivery - the donor,
     * the assigned volunteer, and the requesting orphanage - can read or
     * send messages in its chat thread.
     */
    private void assertParticipant(Delivery delivery, Long userId) {
        boolean isDonor = delivery.getDonation().getDonor().getId().equals(userId);
        boolean isOrphanage = delivery.getOrphanage().getId().equals(userId);
        boolean isVolunteer = delivery.getVolunteer() != null && delivery.getVolunteer().getId().equals(userId);

        if (!isDonor && !isOrphanage && !isVolunteer) {
            throw new IllegalArgumentException("You are not part of this delivery's chat");
        }
    }

    private ChatMessageResponse toResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .deliveryId(message.getDelivery().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .senderRole(message.getSender().getRole().name())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }
}
