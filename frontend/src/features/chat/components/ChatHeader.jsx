import React from "react";
import { Box, Typography } from "@mui/material";

const ChatHeader = ({ title }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default ChatHeader;
