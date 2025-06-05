import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import ChatWindow from "../components/ChatWindow";
import TechChatWindow from "../components/TechChatWindow";
import TestInstructions from "../components/TestInstructions";

const Chat = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
      py: 6
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              color: '#1e293b',
              letterSpacing: '-0.5px'
            }}
          >
            Customer Service Assistant
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              color: '#64748b',
              fontWeight: 400
            }}
          >
            Experience the difference
          </Typography>
        </Box>

        <TestInstructions />

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2,
                color: '#334155',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: '1.3rem'
              }}
            >
              <Box sx={{
                width: '4px',
                height: '26px',
                backgroundColor: '#64748b',
                borderRadius: '2px'
              }} />
              Without Handit AI
            </Typography>
            <Box sx={{ 
              height: '75vh',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: 'none',
              overflow: 'hidden',
              maxWidth: '100%'
            }}>
              <ChatWindow />
            </Box>
          </Box>

          <Box>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 2,
                color: '#334155',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: '1.3rem'
              }}
            >
              <Box sx={{
                width: '4px',
                height: '26px',
                backgroundColor: '#2563eb',
                borderRadius: '2px'
              }} />
              Handit AI Optimization
            </Typography>
            <Box sx={{ 
              height: '75vh',
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '3px solid #4f46e5',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '100%',
            }}>
              <TechChatWindow />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Chat;
