import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./features/chat/pages/Chat";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Chat />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

