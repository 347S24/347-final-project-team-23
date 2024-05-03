// RecentlyPlayedPreview.jsx
import { Box, Grid, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../UserProvider";
import RecentTrackCard from "./../../CustomComponents/RecentTrackCard";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function RecentlyPlayedPreview() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    async function fetchData() {
      const headers = {
        Authorization: `Bearer ${user.access_token}`,
      };
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        { headers }
      );
      if (!response.ok)
        throw new Error("Failed to fetch recently played tracks");
      const data = await response.json();
      setRecentlyPlayed(data.items);
    }

    fetchData();
  }, [user.access_token]);

  const show1 = useMediaQuery(theme.breakpoints.down(912));
  const show4 = useMediaQuery(theme.breakpoints.between(912, 1276));
  const show6 = useMediaQuery(theme.breakpoints.between(1276, 1640));
  const show8 = useMediaQuery(theme.breakpoints.up(1640));

  let numberOfPlaylistsToShow;
  if (show1) {
    numberOfPlaylistsToShow = 1;
  } else if (show4) {
    numberOfPlaylistsToShow = 4;
  } else if (show6) {
    numberOfPlaylistsToShow = 6;
  } else if (show8) {
    numberOfPlaylistsToShow = 8;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Recently Played
      </Typography>
      <Grid container spacing={2}>
        {recentlyPlayed.slice(0, numberOfPlaylistsToShow).map((item) => (
          <Grid item key={item.played_at}>
            <RecentTrackCard height={150} track={item.track} />
          </Grid>
        ))}
      </Grid>
      <Button
        variant="outlined"
        onClick={() => navigate("/recent-tracks")}
        sx={{ mt: 2 }}
      >
        View All
      </Button>
    </Box>
  );
}

export default RecentlyPlayedPreview;
