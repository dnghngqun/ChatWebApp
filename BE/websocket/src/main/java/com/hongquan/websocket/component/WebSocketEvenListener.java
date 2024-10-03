package com.hongquan.websocket.component;

import com.hongquan.websocket.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEvenListener {
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEvenListener.class);
    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @EventListener
    private void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection.");
    }

    @EventListener
    private void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userName = (String) headerAccessor.getSessionAttributes().get("username");
        if(userName != null) {
            logger.info("User Disconnected : " + userName);
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(ChatMessage.ChatType.LEAVE);
            chatMessage.setSender(userName);
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
