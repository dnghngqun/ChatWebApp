package com.hongquan.websocket.controllers;

import com.hongquan.websocket.model.ChatMessage;
import com.hongquan.websocket.model.SignalMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@Controller// Không cần thiết dùng RestController vì không trả ra json, xml
public class ChatController {
    @MessageMapping("/chat/message")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat/addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage chatMessage,
                               SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    @MessageMapping("/chat/signal")
    @SendTo("/topic/public")
    public SignalMessage handleSignaling(SignalMessage signalMessage) {
        // Xử lý tín hiệu WebRTC: Chỉ đơn giản là phát lại cho tất cả client
        return signalMessage;
    }
}
