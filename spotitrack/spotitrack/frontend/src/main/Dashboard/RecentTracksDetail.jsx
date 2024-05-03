// RecentTracksDetail.jsx
import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../UserProvider";
import RecentTrackCard from "../CustomComponents/RecentTrackCard";
import TrackInfoDialog from "../CustomComponents/TrackInfoDialog";
import Loading from "../Loading/Loading";
import { useTheme } from "@emotion/react";

function RecentTracksDetail() {
  const { user } = useUser();
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    async function fetchTracks() {
      const headers = { Authorization: `Bearer ${user.access_token}` };
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        { headers }
      );
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      setTracks(data.items);
      setLoading(false);
    }

    fetchTracks();
  }, [user.access_token]);

  const handleCardClick = (track) => {
    setSelectedTrack(track);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Loading theme={theme} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>
        Recent Tracks
      </Typography>
      <Grid container spacing={3}>
        {tracks.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.played_at}>
            <RecentTrackCard
              track={item.track}
              height={300}
              onClick={() => handleCardClick(item.track)}
            />
          </Grid>
        ))}
      </Grid>
      {selectedTrack && (
        <TrackInfoDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          track={selectedTrack}
        />
      )}
    </Box>
  );
}

export default RecentTracksDetail;
