package com.hongquan.websocket.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignalMessage {
    private String type;  // Loại tín hiệu: OFFER, ANSWER, ICE_CANDIDATE
    private String sender;  // Người gửi
    private Object data;  // Dữ liệu signaling: offer, answer hoặc ICE candidate
}
