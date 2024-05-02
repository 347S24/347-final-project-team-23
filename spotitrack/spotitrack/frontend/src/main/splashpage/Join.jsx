import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import "./styles.css";

Join.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Join(props) {
  const theme = props.theme;
  return (
    <div id='Join'>
    <ThemeProvider theme={theme}>
      <h1>Why Join the Spotitrack Symphony?</h1>
      <List>
        <ListItem>
          <p><em>Unparalleled Insight</em> - Keep a detailed history of your
          Spotify playlists and understand the evolution of your musical taste.</p>
        </ListItem>
        <ListItem>
          <p><em>Connect with Your Past</em> - Rediscover the songs that once
          defined moments of your life and relive the memories.</p>
        </ListItem>
        <ListItem>
          <p><em>Understand Your Present</em> - Witness every beat, every tune, and
          every melody shift as your playlists grow and transform with you.</p>
        </ListItem>
      </List>
      <h3>
      Ready to watch your music grow? Join Spotitrack today and start your journey
      through the melodies of your life.
      </h3>
      </ThemeProvider>
    </div>
  );
}

export default Join;