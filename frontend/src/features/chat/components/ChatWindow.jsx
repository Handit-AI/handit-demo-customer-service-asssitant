import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { generateResponse } from "../services/chatService";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Customer Service Assistant. How can I help you today?",
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text) => {
    try {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text, sender: "user" },
      ]);

      setIsLoading(true);

      const response = await generateResponse(text);

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: response.answer || "I couldn't understand that.",
          sender: "bot",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: error.message || "Sorry, there was an error processing your message.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#fff',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: '#fff',
        flexShrink: 0,
      }}>
        <Typography variant="h6" sx={{ color: '#334155', fontWeight: 600 }}>
          Customer Service Assistant
        </Typography>
      </Box>
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChatWindow;
