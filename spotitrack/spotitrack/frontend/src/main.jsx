import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline'; // Helps to reset CSS and supports dark mode
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';

// Components
import Footer from './footer/Footer.jsx';
import Home from './main/Home';
import About from './main/About';
import Utility from './main/Utility';
import Pitch from './main/Pitch';
import Main from './main/Main';
import Login from './main/login_signup/Login.jsx';
import NavigationBar from './header/NavigationBar.jsx';
import Signup from './main/login_signup/Signup.jsx';
import SpotifyAuthorization from './main/login_signup/SpotifyAuthorization.jsx';
import CompleteSignup from './main/login_signup/CompleteSignup.jsx';
import Dashboard from './main/Dashboard/Dashboard.jsx';

function App() {
  const [mode, setMode] = useState('light'); // Toggle between 'light' and 'dark'

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#67c65c' : '#4caf50', // Light mode green, Dark mode slightly different shade
      },
      secondary: {
        main: mode === 'light' ? '#9C27B0' : '#7b1fa2', // Light mode purple, Dark mode slightly different shade
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none', // Removes uppercase styling from buttons
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin: '8px', // Spacing around buttons
            '&:focus': {
              outline: 'none'  // Removes outline on focus
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            '&:focus': {
              outline: 'none'  // Removes outline on focus
            },
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            '&:focus': {
              outline: 'none'  // Removes outline on focus
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            margin: '8px', // Spacing around text fields
          },
        },
      },
      // You can add additional components here if needed
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Helps to apply consistent baseline styles */}
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/home" element={<Home theme={theme} />} />
          <Route path="/about" element={<About theme={theme} />} />
          <Route path="/use" element={<Utility theme={theme} />} />
          <Route path="/does" element={<Pitch theme={theme} />} />
          <Route path="/login" element={<Login theme={theme} />} />
          <Route path="/signup" element={<Signup theme={theme} />} />
          <Route path="/authorize_spotify" element={<SpotifyAuthorization theme={theme} />} />
          <Route path="/" element={<Main theme={theme} />} />
          <Route path="/dashboard" element={<Dashboard theme={theme} />} />
          <Route path="/complete_signup" element={<CompleteSignup theme={theme} />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
