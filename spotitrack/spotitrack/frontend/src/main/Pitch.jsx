import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import "./styles.css";

Pitch.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Pitch(props) {
  const theme = props.theme;
  return (
    <div id="Pitch">
    <ThemeProvider theme={theme}>
      <h1>Your Music Diary</h1>
      <p>
      Spotitrack isn&apos;t just about music; it&apos;s about moments. It&apos;s
      about that summer hit that played at every party or that comforting melody
      during a rainy day. With Spotitrack, your playlists tell a story - your story.
      By keeping a detailed history of your playlists, Spotitrack helps you
      connect with your past, understand your present, and anticipate the
      future of your musical journey.
      </p>
      </ThemeProvider>
    </div>
  );
}

export default Pitch;
