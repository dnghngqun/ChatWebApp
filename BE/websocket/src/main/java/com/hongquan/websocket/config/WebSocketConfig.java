package com.hongquan.websocket.config;

import com.hongquan.websocket.ws.DataHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Configuration
@EnableWebSocketMessageBroker //bật tính năng WebSocket server
@EnableWebSocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer, WebSocketConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Tin nhắn từ client gửi lên sẽ bắt đầu bằng /app
        registry.setApplicationDestinationPrefixes("/app");
        // Tin nhắn từ server gửi về client sẽ có tiền tố /topic
        registry.enableSimpleBroker("/topic");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        /*
         *  SockJS được sử dụng để bật tùy chọn dự phòng
         *  cho các trình duyệt không hỗ trợ websocket.
        */
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new TextWebSocketHandler(), "/ws")
                .setAllowedOrigins("http://localhost:3000") // Cho phép kết nối từ frontend (http://localhost:3000)
                .withSockJS();  // Nếu bạn sử dụng SockJS, thêm với phần này
    }
}
