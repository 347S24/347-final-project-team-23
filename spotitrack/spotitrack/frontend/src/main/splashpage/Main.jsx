import { ThemeProvider } from "@mui/system";
import { useTheme } from "@mui/material/styles";

import Home from "./Home";

function Main() {
  const theme = useTheme();
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
