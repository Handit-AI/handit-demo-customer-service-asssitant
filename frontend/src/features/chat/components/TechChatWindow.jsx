import React, { useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { generateResponse } from "../services/chatService";

const TechChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Customer Service Assistant. How can I help you today?",
      sender: "bot",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [handitEnabled, setHanditEnabled] = useState(true);

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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5,
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: '#f1f4f9',
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#4f46e5',
              fontWeight: 500,
            }}
          >
            Handit AI
          </Typography>
          <Switch
            checked={handitEnabled}
            onChange={(e) => setHanditEnabled(e.target.checked)}
            color="primary"
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#4f46e5',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#4f46e5',
              },
            }}
          />
        </Box>
      </Box>
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default TechChatWindow; 