import { Client } from "@stomp/stompjs";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import "./css/Chat.css";
const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  var name = location.state;
  //   const [usernames, setUsernames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const chatContentRef = useRef(null);
  // tự động cuộn khi có tin nhắn
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  //   navigate to home if user null
  useEffect(() => {
    if (!name) {
      navigate("/");
      return;
    }

    const socket = new SockJS("https://chatwebappbe-production.up.railway.app/ws");
    const client = new Client({
      webSocketFactory: () => socket,

      onConnect: () => {
        console.log("Connected!");

        // Đăng ký nhận tin nhắn
        client.subscribe("/topic/public", (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        client.publish({
          destination: "/app/chat/addUser",
          body: JSON.stringify({ sender: name, type: "JOIN" }),
        });
      },
      onStompError: (frame) => {
        console.error(`Broker reported error: ${frame.headers["message"]}`);
        console.error(`Additional details: ${frame.body}`);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error observed:", event);
      },
    });
    client.activate();
    setStompClient(client);

    const handleLeavePage = () => {
      if (client && client.connected) {
        client.publish({
          destination: "/app/chat/addUser",
          body: JSON.stringify({ sender: name, type: "LEAVE" }),
        });
        name = null;
      }
    };
    return () => {
      if (client) client.deactivate();
      window.removeEventListener("beforeunload", handleLeavePage);
    };
  }, [name, navigate]);

  // generate random color
  const getRandomColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`; // Hue ngẫu nhiên, saturation và lightness cố định
    return color;
  };

  // Gửi tin nhắn
  const sendMessage = () => {
    if (inputMessage && stompClient && stompClient.connected) {
      const chatMessage = {
        sender: name,
        content: inputMessage,
        type: "CHAT",
      };
      stompClient.publish({
        destination: "/app/chat/message",
        body: JSON.stringify(chatMessage),
      }); // Gửi tin nhắn qua STOMP
      setInputMessage(""); // Reset input sau khi gửi
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  console.log(name);
  console.log("Message: ", messages);

  return (
    <div id="container-chat">
      <h1 className="title">
        <b>Chat</b>
      </h1>
      <hr />
      <ul className="chat-content" ref={chatContentRef}>
        {messages.map((mess, index) => {
          return (
            <>
              {mess.type === "JOIN" && (
                <li key={index} className="chat-noti chat-item">
                  <span>{mess.sender} vừa vào!</span>
                </li>
              )}
              {mess.type === "LEAVE" && (
                <li key={index} className="chat-noti chat-item">
                  <span>{mess.sender} vừa rời đi!</span>
                </li>
              )}
              {mess.type === "CHAT" && (
                <li
                  key={index}
                  className={
                    mess.sender === name && mess.type === "CHAT"
                      ? "chat-request chat-user chat-item"
                      : "chat-response chat-user chat-item"
                  }>
                  <div className="container-chat-item">
                    <div
                      className="avatar"
                      style={{
                        backgroundColor: getRandomColor(mess.sender),
                      }}>
                      {mess.sender.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-item">
                      <span className="username">{mess.sender}</span>

                      <div className="message-container">
                        {mess && (
                          <>
                            <p
                              key={index}
                              className={`${
                                index > 0 &&
                                messages[index - 1].sender !== mess.sender
                                  ? "first-message"
                                  : ""
                              } message-content`}>
                              <span> {mess.content}</span>
                            </p>
                            <br />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              )}
              {/* <li
                className={
                  mess.sender === name && mess.type === "CHAT"
                    ? "chat-request chat-user chat-item"
                    : "chat-response chat-user chat-item"
                }
                style={{
                  display:
                    index > 0 &&
                    messages[index - 1].sender !== mess.sender &&
                    mess.type === "CHAT"
                      ? "none"
                      : "block",
                }}>
                <div className="container-chat-item">
                  <div className="avatar">
                    {mess.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-item">
                    <span className="username">{mess.sender}</span>

                    <div className="message-container">
                      {mess && (
                        <>
                          <p
                            className={`${
                              index > 0 &&
                              messages[index - 1].sender !== mess.sender
                                ? "first-message"
                                : ""
                            } message-content`}>
                            {mess.content}
                          </p>
                          <br />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li> */}
            </>
          );
        })}
      </ul>
      <div className="container-send">
        <input
          type="text"
          placeholder="Enter message..."
          className="input-message"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-send" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
