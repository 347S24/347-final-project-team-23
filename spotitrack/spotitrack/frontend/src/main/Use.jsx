import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import "./styles.css";
function Use() {
  return (
    <div id="Use">
      <h1>Track, Witness, Relive</h1>
      <List>
        <ListItem>
          <p><em>Track seamlessly</em>Add your Spotify playlists in a snap and let Spotitrack handle the rest. Our tracking is smooth, automatic, and uninterrupted.</p>
        </ListItem>
        <ListItem>
          <p><em>Witness Changes</em>Every addition, removal, or shuffle. Watch as your playlists evolve through days, months, and years.</p>
        </ListItem>
        <ListItem>
          <p><em>Relive Memories</em>Dive back into the past with version control of your playlists. Rediscover songs that once defined moments of your life.</p>
        </ListItem>
      </List>
    </div>
  );
}

export default Use;
