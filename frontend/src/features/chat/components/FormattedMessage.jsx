import React from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";

const FormattedMessage = ({ text, isLoading }) => {
  // Function to format JSON strings within the text
  const formatJsonInText = (text) => {
    return text.split(/({.*?})/).map((part, index) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        try {
          const json = JSON.parse(part);
          return (
            <Paper
              key={index}
              sx={{
                p: 1,
                my: 1,
                backgroundColor: "#f8f9fa",
                fontFamily: "monospace",
                fontSize: "0.9em",
                wordBreak: "break-all",
              }}
            >
              {JSON.stringify(json, null, 2)}
            </Paper>
          );
        } catch (e) {
          return part;
        }
      }
      return (
        <Typography
          key={index}
          component="span"
          sx={{
            whiteSpace: "pre-wrap",
            "& .emoji": {
              marginRight: "4px",
            },
          }}
        >
          {part}
        </Typography>
      );
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1,
        }}
      >
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Thinking...
        </Typography>
      </Box>
    );
  }

  return <Box sx={{ my: 1 }}>{formatJsonInText(text)}</Box>;
};

export default FormattedMessage;
