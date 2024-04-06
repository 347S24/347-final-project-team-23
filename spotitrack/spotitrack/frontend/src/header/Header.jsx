// Starter for header component

import logo from "./../assets/logo.svg";


function Header() {
  return (
    <header className={"header-section"}>
      <img
      className={'header-logo'}
                src={logo}
                alt="SpotiTrack logo"
                width={'50px'}
                />
    </header>
  );
}

export default Header;
// Path: spotitrack/spotitrack/frontend/src/header/Header.js
