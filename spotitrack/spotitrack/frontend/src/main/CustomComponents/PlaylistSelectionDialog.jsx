import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { useUser } from "../../UserProvider";

PlaylistSelectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  track: PropTypes.string.isRequired,
};

function PlaylistSelectionDialog({ open, onClose, track }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("users/api/playlist", {
      headers: { Authorization: `Bearer ${user.access_token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      });
  }, [open, user.access_token]);

  // Broken needs fixing
  const handleAddToPlaylist = async (playlistId) => {
    console.log("playlistId: ", playlistId);
    const response = await fetch(`/api/playlists/${playlistId}/add-track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
      body: JSON.stringify({ uris: [track.uri].join(",") }),
    });
    if (response.ok) {
      onClose();
    } else {
      alert("Failed to add track to playlist.");
    }
  };

  // console.log("track: ", track);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Playlist</DialogTitle>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {playlists.map((playlist) => (
            <ListItem
              component="button"
              key={playlist.playlist_id}
              onClick={() => handleAddToPlaylist(playlist.playlist_id)}
            >
              <ListItemText primary={playlist.playlist_name} />
            </ListItem>
          ))}
        </List>
      )}
    </Dialog>
  );
}

export default PlaylistSelectionDialog;
