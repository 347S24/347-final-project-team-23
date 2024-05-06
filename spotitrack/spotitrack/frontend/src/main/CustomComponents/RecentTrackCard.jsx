import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Dialog,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import TrackInfoDialog from "./TrackInfoDialog"; // Adjust the import path as necessary
import PropTypes from "prop-types";
import { useState } from "react";

RecentTrackCard.propTypes = {
  track: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  toggleSaved: PropTypes.func.isRequired, // Manage the save state outside
  isSaved: PropTypes.bool,
};

function RecentTrackCard({ track, height, toggleSaved, isSaved }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Card sx={{ width: height, m: 1, position: "relative" }}>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia
          component="img"
          height={height}
          image={track.album.images[0].url}
          alt={track.name}
          sx={{ objectFit: "cover" }}
        />
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" noWrap>
            {track.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {track.artists.map((artist) => artist.name).join(", ")}
          </Typography>
        </Box>
      </CardActionArea>
      <IconButton
        sx={{ position: "absolute", top: 5, right: 5 }}
        onClick={(event) => {
          event.stopPropagation(); // Prevent the CardActionArea click event
          toggleSaved(); // Call the passed toggleSaved function
        }}
        aria-label={isSaved ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isSaved ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <TrackInfoDialog
        open={dialogOpen}
        onClose={handleClose}
        track={track}
        updateTrackSavedStatus={toggleSaved}
        isSaved={isSaved}
      />
    </Card>
  );
}

export default RecentTrackCard;
