// CustomBadge.js
import { Box, Typography } from "@mui/material";

const CustomBadge = ({ number, children }) => {
  return (
    <Box position="relative" display="inline-block">
      {children}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          backgroundColor: "rgba(0,0,0,0.5)", // Dark background with some opacity
          color: "white",
          padding: "0 8px",
          borderTopLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      >
        <Typography variant="body1">{number}</Typography>
      </Box>
    </Box>
  );
};

export default CustomBadge;
