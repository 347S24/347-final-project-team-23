import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider, Box } from '@mui/system';
import { Grid, Typography, Button, Card, CardContent, CardMedia,
  CardActionArea, CardActions, IconButton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


import './dashboard.css';
import '../../index.css'
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../header/NavigationBar';
import SpotifyLogo from './../login_signup/assets/spotify-logo.svg';



    Dashboard.propTypes = {
      theme: PropTypes.object.isRequired,
      user: PropTypes.object.isRequired,
    };

  function Dashboard(props) {
    const theme = props.theme;
    const navigate = useNavigate();


    // User information and State tracking
    const location = useLocation();
    const user = location.state ? location.state.user : null;

    console.log("user: ", user);

    const username = user.username;
    console.log(user.accessToken);


    if (!user) {
      // Handle the scenario when no user data is passed
      console.log("No user data available.");
      return <div>No user data available. Please login again.</div>;
    }

    // API calls

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const res = await fetch(`/users/api/playlist`);
        const data = await res.json();
        setPlaylists(data);
        console.log("data received from spotify: ", data);
        return data;
      }
      fetchData();
    }, []);


    const handlePlaylistClick = (playlistId) => {
      navigate(`/playlist/${playlistId}`);
    };

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
      <ThemeProvider theme={theme}>
      <div id="dashboard">
      <NavigationBar loggedIn={true} username={username} banner={false}/>
      <Box sx={{ flexGrow: 1,
                bgcolor: 'white',
                minWidth: 300 }}>

      {/* Header with user information and oauth button */}
      <div id="header">
        <Typography variant="h3">Welcome, {user.first_name}!</Typography>
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
      </div>

      {/* Available user palylists */}
      <div className="available_playlists">
        <Typography variant="h4">Your Playlists</Typography>
        {/* <PlaylistGrid /> */}
      </div>


      <Box sx={{ flexGrow: 1,
                  p: 2,
                  bgcolor: 'secondary.accent',
                  border: 2 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {playlists.map((playlist, index) => (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                  <Card>
                  <CardActionArea onClick={() => handlePlaylistClick(playlist.id)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={playlist.imageUrl || "https://via.placeholder.com/140"} // Replace with your default image if no URL is available
                        alt={playlist.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div"
                        color={'primary'}>
                          {playlist.playlist_name}
                        </Typography>
                        <Box sx={{ display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end'
                                 }}>
                        <Stack>
                        <Typography variant="body2" color="secondary.light">
                          {playlist.tracks} tracks
                        </Typography>
                        <Typography variant="body2" color="secondary">
                          by {playlist.author}
                        </Typography>
                        </Stack>
                        </Box>
                      </CardContent>
                      </CardActionArea>
                      <CardActions sx={{
                                        bgcolor: 'black'
                                        }}>
                        <Button size="small" color="primary">
                          track
                        </Button>
                        <IconButton aria-label="favorite" size="small" color="primary">
                            <FavoriteBorderIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
      </Box>

        <p>your name is {user.first_name} {user.last_name}</p>
        <p>your email is {user.email}</p>
        <p>your username is {user.username}</p>
        <p>your password is {user.password}</p>
        </Box>
      </div>
      </ThemeProvider>
    );
  }
  export default Dashboard;
