import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import "./styles.css";


About.propTypes = {
  theme: PropTypes.object.isRequired,
};


function About(props) {

  const theme = props.theme;

  return (

    <div id="About">
    <ThemeProvider theme={theme}>
    <h1>
      Discover Spotitrack - Your Playlist Time Machine
    </h1>
    <p>
    Spotitrack is more than just a music tracker; it&apos;s a gateway to
    rediscover the evolution of your musical taste. Born from a passion
    for music and technology, Spotitrack offers you a unique opportunity
     to track the changes in your Spotify playlists over time. Witness
     every beat, every tune, and every melody shift as your playlists
     grow and transform with you.
     </p>
</ThemeProvider>
    </div>
  );
}
export default About;
