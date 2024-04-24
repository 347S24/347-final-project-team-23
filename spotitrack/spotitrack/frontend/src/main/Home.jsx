import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import "./styles.css";

Home.propTypes = {
  theme: PropTypes.object.isRequired,
};


function Home(props) {
  const theme = props.theme;

  return (
    <div id={"Home"}>
    <ThemeProvider theme={theme}>
      <h1 id="callout">SpotiTrack</h1>
      <h3><em>Evolve Your Music Journey</em> -
      Track the life of your Spotify playlists!</h3>
      </ThemeProvider>
    </div>
  );
}

export default Home;
