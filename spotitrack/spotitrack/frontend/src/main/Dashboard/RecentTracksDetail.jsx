// RecentTracksDetail.jsx
import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../UserProvider";
import RecentTrackCard from "../CustomComponents/RecentTrackCard";
import Loading from "../Loading/Loading";
import { useTheme } from "@emotion/react";

// RecentTracksDetail.jsx
function RecentTracksDetail() {
  const { user } = useUser();
  const [tracks, setTracks] = useState([]);
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
      const trackIds = data.items.map((item) => item.track.id).join(",");
      const savedResponse = await fetch(
        `https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds}`,
        { headers }
      );
      const savedStatus = await savedResponse.json();

      const tracksWithSavedStatus = data.items.map((item, index) => ({
        ...item,
        isSaved: savedStatus[index],
      }));

      setTracks(tracksWithSavedStatus);
      setLoading(false);
    }

    fetchTracks();
  }, [user.access_token]);

  const toggleSavedState = async (trackId, isSaved) => {
    const method = isSaved ? "DELETE" : "PUT";
    const headers = {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    };
    await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
      method,
      headers,
    });

    // Update the local state to reflect the change
    setTracks((tracks) =>
      tracks.map((track) =>
        track.track.id === trackId ? { ...track, isSaved: !isSaved } : track
      )
    );
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
              isSaved={item.isSaved}
              toggleSaved={() => toggleSavedState(item.track.id, item.isSaved)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RecentTracksDetail;
