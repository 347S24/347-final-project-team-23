import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';

import './../../index.css'
import './style.css'
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import SpotifyLogo from './assets/spotify-logo.svg'; // Import the SVG file
import NavigationBar from '../../header/NavigationBar';

SpotifyAuthorization.propTypes = {
  theme: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

function SpotifyAuthorization(props) {

  const user = props.user;

  const callOAuth = async () => {

    try {
        const response = await fetch('/users/api/authorization', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let authorizationUrl = await response.text();
        authorizationUrl = authorizationUrl.replace(/^"|"$/g, '');
        console.log('Authorization URL:', authorizationUrl);
        window.location = authorizationUrl;
        console.log(window.location);

    } catch (error) {
        console.error('Failed to fetch authorization URL:', error);
    }
  };

  return (
    <ThemeProvider theme={props.theme}>
      <NavigationBar loggedIn={false} banner={true} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'top',
        spacing: 20,
        padding: '40px',
      }}>
        <Typography variant="h3">One last thing...</Typography>
        <Typography variant="h4">Authorize SpotiTrack to access your Spotify account</Typography>
        <Typography variant="p">This will allow us to track your playlists for you</Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'top',
        spacing: 20,
        padding: '40px',
      }}>
        <Button
        variant="contained"
        color="primary"
        sx={{
          padding: '40px', // Adjust padding as needed
          display: 'flex', // Ensures the icon centers in the button
          justifyContent: 'center'
        }}
        onClick={callOAuth}
      >
        <img src={SpotifyLogo} alt="Spotify logo" style={{
          width: '80px', // Adjust size as needed
          height: '80px', // Adjust size as needed
        }} />
      </Button>
      </Box>
    </ThemeProvider>
  );
}

export default SpotifyAuthorization;
