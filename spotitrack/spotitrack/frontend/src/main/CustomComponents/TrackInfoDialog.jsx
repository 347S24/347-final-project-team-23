import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { useState } from "react";
import PropTypes from "prop-types";
import { useUser } from "../../UserProvider";
import { useEffect } from "react";
import PlaylistSelectionDialog from "./PlaylistSelectionDialog.jsx";

TrackInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  track: PropTypes.object.isRequired,
  updateTrackSavedStatus: PropTypes.func.isRequired,
  isSaved: PropTypes.bool.isRequired,
};

function TrackInfoDialog({
  open,
  onClose,
  track,
  updateTrackSavedStatus,
  isSaved,
}) {
  const { user } = useUser();
  const [isInLibrary, setIsInLibrary] = useState(track.isSaved);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);

  useEffect(() => {
    // This effect ensures that isInLibrary is updated whenever the track changes
    setIsInLibrary(track.isSaved);
  }, [track]);

  const toggleInLibrary = async () => {
    const newIsInLibrary = !isInLibrary;
    setIsInLibrary(newIsInLibrary); // Optimistically update the UI
    const method = newIsInLibrary ? "PUT" : "DELETE";
    const headers = {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `https://api.spotify.com/v1/me/tracks?ids=${track.id}`,
      {
        method,
        headers,
      }
    );

    if (!response.ok) {
      console.error("Failed to update track library status");
      setIsInLibrary(isInLibrary); // Revert the UI change on error
    } else {
      updateTrackSavedStatus(track.id, newIsInLibrary); // Update parent state on success
    }
  };

  const handleOpenPlaylistDialog = () => {
    setPlaylistDialogOpen(true);
  };

  const handleClosePlaylistDialog = () => {
    setPlaylistDialogOpen(false);
  };

  const handleAddToPlaylist = () => {
    // Placeholder for opening a dialog to add to a playlist
    console.log("Add to Playlist clicked");
  };

  // console.log(track);
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="track-info-title">
      <DialogTitle id="track-info-title">
        {track.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" color="text.secondary">
          {track.artists.map((artist) => artist.name).join(", ")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Album: {track.album.name}
        </Typography>
        <Card sx={{ display: "flex", flexDirection: "row" }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="column" spacing={2} mt={2}>
              <IconButton onClick={toggleInLibrary}>
                {isSaved ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {isSaved ? "Remove" : "Add to Library"}
              </Typography>
              <IconButton onClick={handleOpenPlaylistDialog}>
                <LibraryAddIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Add to playlist
              </Typography>
            </Stack>
          </CardContent>
          <PlaylistSelectionDialog
            open={playlistDialogOpen}
            onClose={handleClosePlaylistDialog}
            track={track}
          />
          <CardMedia
            component="img"
            sx={{ width: 500, height: 500 }}
            image={track.album.images[0].url}
            alt="album art"
          />
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default TrackInfoDialog;
