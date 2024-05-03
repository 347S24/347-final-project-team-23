// RecentTrackCard.jsx
import {
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";

RecentTrackCard.propTypes = {
  track: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  onClick: PropTypes.func, // Accept an onClick handler
};

function RecentTrackCard({ track, height, onClick }) {
  return (
    <Card sx={{ width: height, m: 1 }}>
      <CardActionArea onClick={onClick}>
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
    </Card>
  );
}

export default RecentTrackCard;
