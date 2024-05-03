import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/system";

import Button from "@mui/material/Button";
import { Box, Stack } from "@mui/material";
import SpotifyLogo from "./assets/spotify-logo.svg"; // Import the SVG file
// import { useUser } from "../../UserProvider";
import { useTheme } from "@mui/material/styles";

function SpotifyAuthorization() {
  // const user = useUser();
  const theme = useTheme();

  const callOAuth = async () => {
    try {
      const response = await fetch("/users/api/authorization", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      let authorizationUrl = await response.text();
      authorizationUrl = authorizationUrl.replace(/^"|"$/g, "");
      console.log("Authorization URL:", authorizationUrl);
      window.location = authorizationUrl;
      console.log(window.location);
    } catch (error) {
      console.error("Failed to fetch authorization URL:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          padding: "200px",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "top",
            spacing: 20,
            padding: "40px",
          }}
        >
          <Typography variant="h3">One last thing...</Typography>
          <Typography
            variant="h4"
            sx={{
              paddingTop: "30px",
            }}
          >
            Authorize SpotiTrack to access your Spotify account
          </Typography>
          <Typography variant="p">
            This will allow us to track your playlists for you
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "top",
            spacing: 20,
            padding: "40px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              padding: "40px", // Adjust padding as needed
              display: "flex", // Ensures the icon centers in the button
              justifyContent: "center",
            }}
            onClick={callOAuth}
          >
            <img
              src={SpotifyLogo}
              alt="Spotify logo"
              style={{
                width: "80px", // Adjust size as needed
                height: "80px", // Adjust size as needed
              }}
            />
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default SpotifyAuthorization;
