import React from 'react';
import { Box, Container } from '@mui/material';
import ChatWindow from './ChatWindow';
import TechChatWindow from './TechChatWindow';

const ChatContainer = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '200vh', // Double the height to accommodate both windows
        backgroundColor: '#f5f5f5',
        padding: 0,
        margin: 0,
      }}
    >
      <Box sx={{ height: '100vh' }}>
        <ChatWindow />
      </Box>
      <Box sx={{ height: '100vh' }}>
        <TechChatWindow />
      </Box>
    </Container>
  );
};

export default ChatContainer; 