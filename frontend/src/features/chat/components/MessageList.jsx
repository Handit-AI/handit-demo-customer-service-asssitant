import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const MessageList = ({ messages, isLoading }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '20px',
        backgroundColor: 'transparent',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
        },
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.sender === 'bot' ? 'flex-start' : 'flex-end',
            mb: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: {
                xs: '85%',
                sm: '70%'
              },
              width: 'fit-content',
              padding: '12px 16px',
              backgroundColor: message.sender === 'bot' ? '#f1f3f4' : '#1a73e8',
              color: message.sender === 'bot' ? '#202124' : '#fff',
              borderRadius: message.sender === 'bot' ? '0 8px 8px 8px' : '8px 0 8px 8px',
              wordBreak: 'break-word',
            }}
          >
            <Typography
              variant="body1"
              component="div"
              sx={{
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {message.text}
            </Typography>
          </Box>
        </Box>
      ))}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            padding: '12px 16px',
            backgroundColor: '#f1f3f4',
            borderRadius: '0 8px 8px 8px',
            width: 'fit-content',
            mb: 2,
          }}
        >
          <CircularProgress size={16} thickness={4} />
          <Typography variant="body2" color="#5f6368">
            Typing...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MessageList;
