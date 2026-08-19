package com.donation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Sends a notification to one specific user (matched by their email,
     * which is what we set as the STOMP Principal during connect).
     */
    public void notifyUser(String email, String message) {
        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/notifications",
                Map.of("message", message, "timestamp", System.currentTimeMillis())
        );
    }

    /**
     * Broadcasts to everyone subscribed to a topic - used for "a new delivery
     * just opened up" style announcements to all volunteers at once.
     */
    public void broadcast(String topic, String message) {
        messagingTemplate.convertAndSend(
                "/topic/" + topic,
                Map.of("message", message, "timestamp", System.currentTimeMillis())
        );
    }
}
