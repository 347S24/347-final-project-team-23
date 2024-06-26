// React core imports
import { useEffect, useState } from "react";

// React Router DOM
import { useNavigate } from "react-router-dom";

// Material-UI System
import { ThemeProvider, Box } from "@mui/system";
import { useTheme } from "@mui/material/styles";

// Material-UI Components
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Stack,
} from "@mui/material";

// Custom Components and Assets
import Loading from "../Loading/Loading.jsx";
import AuthButton from "../AuthButton/AuthButton.jsx";
import { useUser } from "../../UserProvider.jsx";

function Playlists() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useUser();

  // State tracking for loading and error handling
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
  }, []);

  // const handlePlaylistClick = (playlistId) => {
  //   console.log("Playlist clicked: ", playlistId);
  //   navigate(`/playlist`, { state: { user: user, playlistId: playlistId } });
  // };
  const handlePlaylistClick = (playlistId) => {
    console.log("Playlist clicked: ", playlistId);
    navigate(`/playlist-history/${playlistId}`);
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

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Typography variant="h4" color="error">
          Error: {error} Please reauthorize SpotiTrack
        </Typography>
        <AuthButton />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "top",
          spacing: 20,
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 300, padding: "40px" }}>
          {/* Header with user information and oauth button */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Welcome, {user.first_name}!</Typography>
          </Box>

          {/* Available user palylists */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              justifyContent: "top",
              spacing: 20,
              padding: "10px",
            }}
          >
            <Typography variant="h4">Your Playlists</Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              bgcolor: "secondary",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid
              container
              // spacing={{ xs: 2, md: 2 }}
              columns={{ xs: 4, sm: 12, md: 12, lg: 12, xl: 12 }}
            >
              {playlists.map((playlist, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  xl={3}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      width: 300,
                      position: "relative", // This makes the positioning of the children absolute relative to the card
                    }}
                  >
                    <CardActionArea
                      onClick={() => handlePlaylistClick(playlist.playlist_id)}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={
                          playlist.image || "https://via.placeholder.com/140"
                        } // Default image if none is provided
                        alt={playlist.name}
                      />

                      {/* This CardContent will overlay the CardMedia */}
                      <CardContent
                        sx={{
                          position: "absolute", // Position absolutely to overlay on the image
                          bottom: 0, // Align to the bottom of the Card
                          left: 0, // Align to the left of the Card
                          width: "100%", // Take full width of the Card
                          backgroundImage:
                            "linear-gradient(rgba(0, 0, 0, 0.3) 15%, rgba(0, 0, 0, 0.7) 40%, rgba(0, 0, 0, 0.9))",
                          color: "white", // Text color
                          padding: 2, // Padding inside the CardContent
                        }}
                      >
                        <Stack
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <Typography
                            variant="h6"
                            component="div"
                            sx={{
                              textShadow: "1px 1px 2px black",
                            }}
                          >
                            {playlist.playlist_name.length > 22
                              ? `${playlist.playlist_name.substring(0, 21)}...`
                              : playlist.playlist_name}
                          </Typography>
                          <Typography variant="body2" color={"primary"}>
                            by {playlist.author}
                          </Typography>
                          <Typography variant="body2" color={"textSecondary"}>
                            {playlist.number_of_tracks} tracks
                          </Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
export default Playlists;
