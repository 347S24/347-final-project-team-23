import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline"; // Helps to reset CSS and supports dark mode
import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme.jsx";
// Components
import Footer from "./footer/Footer.jsx";
import Home from "./main/splashpage/Home.jsx";
import Main from "./main/splashpage/Main.jsx";
import Login from "./main/login_signup/Login.jsx";
import Signup from "./main/login_signup/Signup.jsx";
import SpotifyAuthorization from "./main/login_signup/SpotifyAuthorization.jsx";
import CompleteSignup from "./main/login_signup/CompleteSignup.jsx";
import Dashboard from "./main/Dashboard/Dashboard.jsx";
import PlaylistDetail from "./main/Dashboard/PlaylistDetail.jsx"; // Import the missing component

function App() {
  const [mode, setMode] = useState("dark"); // Toggle between 'light' and 'dark'

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Helps to apply consistent baseline styles */}
      <Router>
        {/* <NavigationBar /> */}
        <Routes>
          <Route path="/home" element={<Home theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/signup" element={<Signup theme={theme} />} />
          <Route
            path="/authorize_spotify"
            element={<SpotifyAuthorization theme={theme} />}
          />
          <Route path="/" element={<Main theme={theme} />} />
          <Route
            path="/complete_signup"
            element={<CompleteSignup theme={theme} />}
          />
          <Route path="/dashboard" element={<Dashboard theme={theme} />} />
          <Route path="/playlist" element={<PlaylistDetail theme={theme} />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
