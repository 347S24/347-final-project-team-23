import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider, Box } from '@mui/system';
import { Grid, Typography, Button, Card, CardContent, CardMedia, CardActionArea, CardActions, IconButton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


import './dashboard.css';
import './../../index.css'



    Dashboard.propTypes = {
      theme: PropTypes.object.isRequired,
    };

  function Dashboard(props) {
    const theme = props.theme;


    // User information and State tracking
    const location = useLocation();
    const user = location.state ? location.state.user : null;

    const username = user.username;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const email = user.email;
    const password = user.password;
    const token = user.access_token;
    console.log("token: ", token);


    if (!user) {
      // Handle the scenario when no user data is passed
      console.log("No user data available.");
      return <div>No user data available. Please login again.</div>;
    }

    // console.log("Location state:", location.state);

    // console.log("The users information is: ", username, first_name, last_name, email, password)



    // API calls

    const callOAuth = async () => {
      try {
          // Call the API endpoint to get the authorization URL
          const response = await fetch('/users/api/authorization', {
              method: 'GET', // Method itself is GET by default, so this is optional
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

          // Redirect the user to the authorization URL obtained from the API
          window.location = authorizationUrl;
      } catch (error) {
          console.error('Failed to fetch authorization URL:', error);
      }
    };

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
      async function fetchData() {
        const username = 'salmankhattak2017';
        const res = await fetch(`/users/api/playlist/${username}?username=${username}`);
        const data = await res.json();
        setPlaylists(data);
        console.log("data received from spotify: ", data);
        return data;
      }
      fetchData();
    }, []);

    //  FETCH ALL PLAYLISTS -- NEED ACCESS TOKEN
    // async function fetchAllPlaylists(accessToken) {
    //   let url = 'https://api.spotify.com/v1/me/playlists?limit=50';
    //   let playlists = [];

    //   while (url) {
    //     const response = await fetch(url, {
    //       headers: { 'Authorization': `Bearer ${accessToken}` }
    //     });
    //     const data = await response.json();
    //     playlists = playlists.concat(data.items);
    //     url = data.next;  // Update the URL to the next page of playlists, or null if there are no more pages
    //   }

    //   return playlists;
    // }


    // EXAMPLE FETCH DETAILED PLAYLIST -- NEED TO IMPLENENT
    // useEffect(() => {
    //   const username = 'Sacr3d';
    //   const playlist_id = '7AqyxOJ8sodMKovIVWqvDV';
    //   const fetchUrl = `/users/api/tracks/${username}/${playlist_id}?username=${username}&playlist_id=${playlist_id}`;

    //   const fetchData = async () => {
    //       const res = await fetch(fetchUrl);
    //       const data = await res.json();
    //       console.log(data); // Log full data to see the structure
    //       if (data.tracks && data.tracks.length > 0) {
    //           console.log(data.tracks[0].album.artUrl);
    //       }
    //   };

    //   fetchData();
    // }, []);


    return (
      <ThemeProvider theme={theme}>
      <div id="dashboard">
      <Box sx={{ flexGrow: 1,
                bgcolor: 'white',
                minWidth: 300 }}>

      {/* Header with user information and oauth button */}
      <div id="header">
        <Typography variant="h3">Welcome, {user.first_name}!</Typography>
        <div id="oauth">
          <Typography variant="p">Haven&apos;t linked your spotify yet?</Typography>
          <Button variant="text"
          color="primary"
          onClick={callOAuth}>
          oAuth
          </Button>
        </div>
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
                  <CardActionArea>
                      <CardMedia
                        component="img"
                        height="140"
                        image={playlist.imageUrl || "https://via.placeholder.com/140"} // Replace with your default image if no URL is available
                        alt={playlist.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div"
                        color={'primary'}>
                          {playlist.name}
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
                          by {playlist.owner}
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
