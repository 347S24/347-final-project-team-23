// starter for main page
import "./styles.css";

import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';


import About from "./About";
import Pitch from "./Pitch";
import Home from "./Home";
import Join from "./Join";
import Utility from "./Utility";


Main.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Main(props) {
  const theme = props.theme;
  return (
    <ThemeProvider theme={theme}>
    <div className="Main">
      <Home />
      <About />
      <Utility />
      <Pitch />
      <Join />
    </div>
    </ThemeProvider>
  );
}

export default Main;
// Path: spotitrack/spotitrack/frontend/src/header/Header.js
