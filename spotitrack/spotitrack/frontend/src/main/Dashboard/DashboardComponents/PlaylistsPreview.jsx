import { Box, Grid, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import PlaylistCard from "./../../CustomComponents/PlaylistCard.jsx";

PlaylistsPreview.propTypes = {
  playlists: PropTypes.array.isRequired,
  onExploreAll: PropTypes.func.isRequired,
};
function PlaylistsPreview({ playlists, onExploreAll }) {
  // console.log("Playlists: ", playlists);
  return (
    <Box>
      <Typography variant="h4">Your Playlists</Typography>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {playlists.map((playlist) => (
          <Grid item key={playlist.playlist_id}>
            <PlaylistCard playlist={playlist} />
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" onClick={onExploreAll}>
        Explore All
      </Button>
    </Box>
  );
}

export default PlaylistsPreview;
