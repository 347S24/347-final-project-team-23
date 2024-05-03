import { ThemeProvider } from "@mui/system";
import { Box, Typography, Link, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CompleteSignup = () => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Box
        id="bg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "top",
          spacing: 20,
          padding: "300px",
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
          <Typography variant="h2" align="center">
            Signup Completed!
          </Typography>

          <Typography variant="h4" align="center">
            Welcome to SpotiTrack!
          </Typography>

          <Typography
            variant="p"
            align="center"
            sx={{
              padding: "40px",
            }}
          >
            Click{" "}
            <Link href="/login" underline="hover">
              Here
            </Link>{" "}
            to login and begin tracking your playlists.
          </Typography>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default CompleteSignup;
