import { mirage } from "ldrs";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { ThemeProvider } from "@emotion/react";
mirage.register();

Loading.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Loading(props) {
  const theme = props.theme;
  const primary = theme.palette.primary.main;
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <l-mirage size="300" speed="3.6" color={primary}></l-mirage>
        <Typography padding={"40px"} variant="h2" color={"primary"}>
          SpotiTrack
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default Loading;
