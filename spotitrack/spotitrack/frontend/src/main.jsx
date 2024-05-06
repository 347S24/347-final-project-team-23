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
import Playlists from "./main/Dashboard/Playlists.jsx";
import PlaylistDetail from "./main/Dashboard/PlaylistDetail.jsx";
import { UserProvider } from "./UserProvider.jsx";
import NavigationBar from "./header/NavigationBar.jsx";
import RecentTracksDetail from "./main/Dashboard/RecentTracksDetail.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import PlaylistHistory from "./main/Playlists/PlaylistHistory.jsx";

function App() {
  const [mode, setMode] = useState("dark"); // Toggle between 'light' and 'dark'

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Helps to apply consistent baseline styles */}
        <Router>
          <NavigationBar />
          <ScrollToTop />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/authorize_spotify"
              element={<SpotifyAuthorization />} // user thing make sure to come back
            />
            <Route path="/" element={<Main />} />
            <Route path="/complete_signup" element={<CompleteSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlist" element={<PlaylistDetail />} />
            <Route path="/recent-tracks" element={<RecentTracksDetail />} />
            <Route
              path="/playlist-history/:playlistId"
              element={<PlaylistHistory />}
            />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
