import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import AuthContextProvider from "./firebase/authContext.tsx";
import "@fontsource-variable/inter";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter Variable', sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Router>
    </AuthContextProvider>
  </React.StrictMode>
);
