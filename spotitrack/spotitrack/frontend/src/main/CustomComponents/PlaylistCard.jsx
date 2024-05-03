// PlaylistCard.jsx
import { Card, CardActionArea, CardMedia } from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

PlaylistCard.propTypes = {
  playlist: PropTypes.object.isRequired,
};

function PlaylistCard({ playlist }) {
  const location = useLocation();
  const user = location.state ? location.state.user : null;
  const navigate = useNavigate();

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist`, { state: { user: user, playlistId: playlistId } });
  };

  return (
    <Card width="150">
      <CardActionArea onClick={() => handlePlaylistClick(playlist.playlist_id)}>
        <CardMedia
          component="img"
          image={playlist.image || "https://via.placeholder.com/140"}
          alt={playlist.playlist_name}
          sx={{
            height: 150,
            width: 150,
            objectFit: "cover",
          }}
        />
      </CardActionArea>
    </Card>
  );
}

export default PlaylistCard;
