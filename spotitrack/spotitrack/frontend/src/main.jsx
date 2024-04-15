import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Footer from './footer/Footer.jsx'
import Home from './main/Home';
import About from './main/About';
import Utility from './main/Utility';
import Pitch from './main/Pitch';
import Main from './main/Main';
import Login from './main/login_signup/Login.jsx';
import NavigationBar from './header/NavigationBar.jsx';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Signup from './main/login_signup/Signup.jsx';
import Confirmation from './main/login_signup/Confirmation.jsx';
import Dashboard from './main/Dashboard.jsx';


const theme = createTheme({
  palette: {
    primary: {
      /*  It's daerk grey right now  */
      main: '#3c3c3c',
      accent: '##1c1c1c'
    },
    secondary: {
      /*  It's green right now  */
      main: '#67c65c',
      accent: '#9cc65c',
      analog: '#5cc686'
    },
    warning: {
      main: '#F0803C',
      accent: '#f03c51',
      analog: '#f0db3c'
    },
    error: {
      main: '#D64550',
      accent: '#d6459a',
      analog: '#d68145'
    },
    white: {
      main: '#E6E6EA',
      accent: '#eaeae6',
    }
  },
});

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/use" element={<Utility />} />
          <Route path="/does" element={<Pitch />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm_email" element={<Confirmation />} />
          <Route path="/" element={<Main />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
