import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Header from './header/Header.jsx'
import Footer from './footer/Footer.jsx'
import HeroSection from './main/HeroSection';
import About from './main/About';
import Use from './main/Use';
import Does from './main/Does';
import Join from './main/Join';
import Main from './main/Main';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/home" component={HeroSection} />
        <Route path="/about" component={About} />
        <Route path="/use" component={Use} />
        <Route path="/does" component={Does} />
        <Route path="/join" component={Join} />
        <Route path="/" component={Main} />
      </Routes>
      <Main />
      <Footer />
    </Router>
  </React.StrictMode>,
)
