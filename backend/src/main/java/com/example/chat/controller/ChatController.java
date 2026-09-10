package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import java.time.Instant;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ChatController {

  @MessageMapping("/chat.send")
  @org.springframework.messaging.handler.annotation.SendTo("/topic/messages")
  public ChatMessage sendMessage(@Payload ChatMessage message) {
    if (message.getTimestamp() == null) {
      message.setTimestamp(Instant.now());
    }
    return message;
  }

  @GetMapping("/api/health")
  @ResponseBody
  public String health() {
    return "ok";
  }
}
