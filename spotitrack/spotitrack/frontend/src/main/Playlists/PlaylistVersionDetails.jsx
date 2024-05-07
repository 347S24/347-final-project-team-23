import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import CustomBadge from "../CustomComponents/CustomBadge";
import { useUser } from "../../UserProvider";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

PlaylistVersionDetails.propTypes = {
  tracks: PropTypes.array.isRequired,
  version: PropTypes.number.isRequired,
  changes: PropTypes.object.isRequired,
  playlistId: PropTypes.string.isRequired,
};

function PlaylistVersionDetails({ tracks, version, changes, playlistId }) {
  const [trackDetails, setTrackDetails] = useState([]);
  const { user } = useUser();
  const theme = useTheme(); // Utilizing theme for custom styles
  const [open, setOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

  useEffect(() => {
    const fetchTrackDetails = async () => {
      // Assuming you have a function to get your access token
      const details = await Promise.all(
        tracks.map(async (track) => {
          const response = await fetch(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
              },
            }
          );
          return response.json();
        })
      );
      setTrackDetails(details);
    };

    fetchTrackDetails();
  }, [tracks]);

  const handleRestoreCurrentPlaylist = async () => {
    // First, clear the current playlist
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracks: tracks.map((track) => ({ uri: `spotify:track:${track.id}` })),
      }),
    });

    // Then, add the tracks from this version
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: tracks.map((track) => `spotify:track:${track.id}`),
      }),
    });
  };

  const handleCreateNewPlaylist = async () => {
    // Create a new playlist
    const response = await fetch(
      `https://api.spotify.com/v1/users/${user.spotify_id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPlaylistName,
          description: newPlaylistDescription,
          public: false,
        }),
      }
    );
    const newPlaylist = await response.json();

    // Add tracks to the new playlist
    await fetch(
      `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: tracks.map((track) => `spotify:track:${track.id}`),
        }),
      }
    );

    toggleDialog(); // Close the dialog after operation
  };

  // Function to determine the border color based on the track ID
  const getBorderColor = (trackId) => {
    if (changes.removed && changes.removed.includes(trackId)) {
      return theme.palette.error.dark; // red for removed
    } else if (changes.added && changes.added.includes(trackId)) {
      return theme.palette.success.dark; // green for added
    } else if (changes.moved && changes.moved.includes(trackId)) {
      return theme.palette.warning.dark; // yellow for moved
    } else {
      return "transparent"; // no change
    }
  };
  const toggleDialog = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Version {version} Tracks
      </Typography>
      {trackDetails.map((track, index) => (
        <Card
          sx={{
            minWidth: 400,
            maxWidth: 400,
            display: "flex",
            alignItems: "center",
            height: 75,
            mb: 1,
            borderColor: getBorderColor(track.id), // Set border color based on track changes
            borderWidth: 2,
            borderStyle: "solid",
          }}
          key={track.id}
        >
          <CardMedia
            component="img"
            sx={{ width: 75, height: 75, mr: 1 }}
            image={
              track.album.images[0]?.url || "https://via.placeholder.com/50"
            }
            alt={track.name}
          />
          <CardContent sx={{ flexGrow: 1, p: 1 }}>
            <Typography noWrap>{track.name}</Typography>
            <Typography variant="body2" noWrap color="text.secondary">
              {track.artists.map((artist) => artist.name).join(", ")}
            </Typography>
          </CardContent>
          <CustomBadge number={index + 1}>
            <Box sx={{ width: 50, height: 50 }} />
          </CustomBadge>
        </Card>
      ))}
      {/* onClick={handleRestoreCurrentPlaylist} */}
      <Button variant="outlined" onClick={toggleDialog}>
        Create New Playlist with this Version
      </Button>
      <Button variant="contained" onClick={handleRestoreCurrentPlaylist}>
        Restore to this Version
      </Button>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>Create New Playlist</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Playlist Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Cancel</Button>
          <Button onClick={handleCreateNewPlaylist}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PlaylistVersionDetails;
