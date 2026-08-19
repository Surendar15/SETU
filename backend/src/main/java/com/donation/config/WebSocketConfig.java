package com.donation.config;

import com.donation.security.StompAuthChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompAuthChannelInterceptor stompAuthChannelInterceptor;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Clients connect here via a plain WebSocket (no SockJS fallback needed
        // for modern browsers, and it avoids bundler polyfill issues on the frontend).
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Messages sent to /app/** are routed to @MessageMapping controller methods (none needed here yet)
        registry.setApplicationDestinationPrefixes("/app");
        // Messages sent to /topic/** (broadcast) or /user/** (targeted) go straight to subscribed clients
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Authenticates the STOMP CONNECT frame using the JWT the client sends,
        // so convertAndSendToUser(email, ...) can correctly target this user's session.
        registration.interceptors(stompAuthChannelInterceptor);
    }
}