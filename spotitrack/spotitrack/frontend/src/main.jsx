import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Header from './header/Header.jsx'
import Footer from './footer/Footer.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*<App username={username}/>*/}
    <Header />
    <App />
    <Footer />
  </React.StrictMode>,
)
