import { Box, Grid, Paper, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../Loading/Loading.jsx";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import TopArtists from "./DashboardComponents/TopArtists.jsx";
import PlaylistsPreview from "./DashboardComponents/PlaylistsPreview.jsx";
import { useMediaQuery } from "@mui/material";
import { useUser } from "../../UserProvider.jsx";
import RecentlyPlayedPreview from "./DashboardComponents/RecentlyPlayedPreview.jsx";
import UserBanner from "./DashboardComponents/UserBanner.jsx";

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === "dark" ? "#303233" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // border: "2px solid",
  borderColor: theme.palette.primary.main,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flex: 1,
}));

function Dashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { startTokenRefreshCycle, user } = useUser();

  useEffect(() => {
    startTokenRefreshCycle();
  }, [startTokenRefreshCycle]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // fetch playlists
        const res = await fetch(`/users/api/playlist`);
        if (!res.ok) throw new Error("Failed to fetch playlists");
        const data = await res.json();
        setPlaylists(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const show4 = useMediaQuery(theme.breakpoints.down(629));
  const show6 = useMediaQuery(theme.breakpoints.between(630, 812));
  const show8 = useMediaQuery(theme.breakpoints.between(812, 993));
  const show10 = useMediaQuery(theme.breakpoints.between(994, 1175));
  const show12 = useMediaQuery(theme.breakpoints.between(1176, 1358));
  const show14 = useMediaQuery(theme.breakpoints.between(1359, 1539));
  const show16 = useMediaQuery(theme.breakpoints.up(1540));
  const fullBlock = useMediaQuery(theme.breakpoints.down(812));

  let numberOfPlaylistsToShow;
  if (show4) {
    numberOfPlaylistsToShow = 4;
  } else if (show6) {
    numberOfPlaylistsToShow = 6;
  } else if (show8) {
    numberOfPlaylistsToShow = 8;
  } else if (show10) {
    numberOfPlaylistsToShow = 10;
  } else if (show12) {
    numberOfPlaylistsToShow = 12;
  } else if (show14) {
    numberOfPlaylistsToShow = 14;
  } else if (show16) {
    numberOfPlaylistsToShow = 16;
  }

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
  if (error) return <p>Error: {error} </p>;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex",
            flexDirection: "row",
            // alignItems: "center",
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          {/* Welcome message */}
          <Grid item xs={12} spacing={3}>
            <UserBanner />
          </Grid>

          {/* Playlists */}
          <Grid item xs={12}>
            <Item>
              <PlaylistsPreview
                playlists={playlists.slice(0, numberOfPlaylistsToShow)}
                onExploreAll={() => navigate("/playlists")}
              />
            </Item>
          </Grid>

          {/* Top weekly artists */}
          <Grid item xs={fullBlock ? 12 : 6}>
            <Item>
              <TopArtists />
            </Item>
          </Grid>

          {/* Recently Played */}
          <Grid item xs={fullBlock ? 12 : 6}>
            <Item>
              <RecentlyPlayedPreview />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
export default Dashboard;
