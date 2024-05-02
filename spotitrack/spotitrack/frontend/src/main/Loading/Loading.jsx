
import { mirage } from 'ldrs'
import { Box, Typography } from '@mui/material';
mirage.register();

const Loading = () => {
  return (
    <Box>
      <l-mirage
      size="300"
      speed="3.6"
      color="#5dda82"
    ></l-mirage>
    <Typography padding={'40px'} variant="h2" color={'primary'}>
    SpotiTrack
    </Typography>
    </Box>
  );
};

export default Loading


