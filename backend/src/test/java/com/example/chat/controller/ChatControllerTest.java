package com.example.chat.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.chat.model.ChatMessage;
import org.junit.jupiter.api.Test;

class ChatControllerTest {

  private final ChatController controller = new ChatController();

  @Test
  void sendMessageSetsTimestampWhenMissing() {
    ChatMessage message = new ChatMessage();
    message.setSender("alice");
    message.setContent("hello");

    ChatMessage result = controller.sendMessage(message);

    assertEquals("alice", result.getSender());
    assertEquals("hello", result.getContent());
    assertNotNull(result.getTimestamp());
  }
}
