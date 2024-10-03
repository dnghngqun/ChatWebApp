package com.hongquan.websocket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private ChatType type;
    private String content;
    private String sender;
    public enum ChatType{
        LEAVE, JOIN, CHAT
    }
}
