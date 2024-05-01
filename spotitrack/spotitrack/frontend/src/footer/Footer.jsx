// starter for footer component

import { Typography, Box } from "@mui/material";

function Footer() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
    }}>
      <Typography variant="body2" color="textSecondary">
        &copy; 2024 Spotitrack
      </Typography>
    </Box>
  );
}
export default Footer;
// Path: spotitrack/spotitrack/frontend/src/footer/Footer.js
