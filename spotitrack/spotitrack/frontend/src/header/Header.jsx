// Starter for header component
import logo from "./../assets/logo.svg";
import Nav from "./Nav";

import './styles.css';


function Header() {
  return (
    <header className={"top-nav"}>
      <img
      className='logo'
                src={logo}
                alt="SpotiTrack logo"
                width={'50px'}
                />
      <Nav
                links={[
                    { anchor: 'HeroSection', label: 'Home'},
                    { anchor: 'About', label: 'About'},
                    { anchor: 'Use', label: 'What is Spotitrack?'},
                    { anchor: 'Does', label: 'Why Use This?'},
                    { anchor: 'Join', label: 'Login',},
                ]}
            />
    </header>
  );
}

export default Header;
// Path: spotitrack/spotitrack/frontend/src/header/Header.js
