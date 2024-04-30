import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import "./styles.css";
import NavigationBar from "../../header/NavigationBar";
import { Box } from "@mui/material";

Home.propTypes = {
  theme: PropTypes.object.isRequired,
};


function Home(props) {
  const theme = props.theme;

  return (
    <div id={"Home"}>
    <ThemeProvider theme={theme}>
    <Box sx={{ flexGrow: 1,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
             }}>
      <NavigationBar loggedIn={false} static={false} />
    </Box>
    <Box sx={{ flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 35,
             }}>

      <h1 id="callout">SpotiTrack</h1>
      <h3><em>Evolve Your Music Journey</em> -
      Track the life of your Spotify playlists!</h3>
      </Box>
      </ThemeProvider>
    </div>
  );
}

export default Home;
