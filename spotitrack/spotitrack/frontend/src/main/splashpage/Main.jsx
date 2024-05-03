import { ThemeProvider } from "@mui/system";
import PropTypes from "prop-types";

import Home from "./Home";

Main.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Main(props) {
  const theme = props.theme;
  return (
    <ThemeProvider theme={theme}>
      <div className="Main">
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default Main;
// Path: spotitrack/spotitrack/frontend/src/header/Header.js
