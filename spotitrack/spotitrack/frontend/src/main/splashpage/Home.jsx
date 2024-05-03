import { ThemeProvider } from "@mui/system";
import PropTypes from "prop-types";
import { Box, Typography, Stack, Button } from "@mui/material";

import NavigationBar from "../../header/NavigationBar";

Home.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Home(props) {
  const theme = props.theme;

  return (
    <ThemeProvider theme={theme}>
      <NavigationBar theme={theme} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 31,
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" paddingBottom={"30px"}>
            Spotitrack
          </Typography>
          <Typography variant="h4" padding={"15px"} color={"white"}>
            Track the life of your playlists!
          </Typography>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
              gap: "30px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              href="/login"
              sx={{
                margin: "8px",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              href="/signup"
              sx={{
                margin: "8px",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              Signup
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
