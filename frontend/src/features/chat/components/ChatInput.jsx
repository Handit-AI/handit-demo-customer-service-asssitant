import React, { useState } from "react";
import { Box, TextField, IconButton, styled } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  background: 'rgba(255, 255, 255, 0.9)',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backdropFilter: 'blur(10px)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <InputContainer component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-input': {
              padding: '12px 20px',
            },
          }}
        />
        <SendButton
          type="submit"
          disabled={!message.trim()}
          sx={{
            width: 48,
            height: 48,
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              color: 'rgba(0, 0, 0, 0.26)',
            },
          }}
        >
          <SendIcon />
        </SendButton>
      </Box>
    </InputContainer>
  );
};

export default ChatInput;
