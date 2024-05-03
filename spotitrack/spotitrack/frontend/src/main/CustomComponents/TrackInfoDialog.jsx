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

TrackInfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  track: PropTypes.object.isRequired,
};

function TrackInfoDialog({ open, onClose, track }) {
  const [isInLibrary, setIsInLibrary] = useState(false); // Assuming default state is not in library

  const toggleInLibrary = () => {
    // Placeholder for actual API call to add/remove track from library
    setIsInLibrary(!isInLibrary);
  };

  const handleAddToPlaylist = () => {
    // Placeholder for opening a dialog to add to a playlist
    console.log("Add to Playlist clicked");
  };

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
                {isInLibrary ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {isInLibrary ? "Remove" : "Add to Library"}
              </Typography>
              <IconButton onClick={handleAddToPlaylist}>
                <LibraryAddIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                Add to playlist
              </Typography>
            </Stack>
          </CardContent>
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
