// React core imports
import { useEffect, useState } from 'react';

// React Router DOM
import { useNavigate, useLocation } from 'react-router-dom';

// PropTypes
import PropTypes from 'prop-types';

// Material-UI System
import { ThemeProvider, Box } from '@mui/system';

// Material-UI Components
import {
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  IconButton,
  Stack
} from '@mui/material';

// Material-UI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Custom Components and Assets
import NavigationBar from '../../header/NavigationBar';
import Loading from './../Loading/Loading.jsx';
import AuthButton from '../AuthButton/AuthButton.jsx';




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

    const [loading, setLoading] = useState(true); // Initial loading state
    const [error, setError] = useState(null);

    // API calls

    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const res = await fetch(`/users/api/playlist`);
          if (!res.ok) throw new Error('Failed to fetch playlists');
          const data = await res.json();
          setPlaylists(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }
      fetchData();
    }, []);


    const handlePlaylistClick = (playlistId) => {
      console.log("Playlist clicked: ", playlistId);
      navigate(`/playlist`, { state: { user: user, playlistId: playlistId } });
    };



    if (!user) {
      // Handle the scenario when no user data is passed
      console.log("No user data available.");
      return <div>No user data available. Please login again.</div>;
    }

    if (loading) {
      return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw'
        }}>
          <Loading />
        </Box>
      );
    }

    if (error) {
      return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
      <Typography
        variant="h4" color="error">Error: {error} Please reauthorize SpotiTrack
      </Typography>
      <AuthButton />
      </Box>;
    }

    return (
      <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'top',
        spacing: 20,
      }}>
      <NavigationBar loggedIn={true} username={username} banner={false}/>
      <Box sx={{ flexGrow: 1,
                bgcolor: 'white',
                minWidth: 300,
                padding: '40px' }}>

      {/* Header with user information and oauth button */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography variant="h3">Welcome, {user.first_name}!</Typography>
        <AuthButton />
      </Box>

      {/* Available user palylists */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'top',
        spacing: 20,
        padding: '10px',
      }}>
        <Typography variant="h4">Your Playlists</Typography>
      </Box>


      <Box sx={{ flexGrow: 1,
                  p: 2,
                  bgcolor: 'secondary',
                  }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {playlists.map((playlist, index) => (
                  <Grid item xs={2} sm={4} md={4} key={index}>
                  <Card sx={{
                    maxWidth: 350,
                  }}>
                  <CardActionArea onClick={() => handlePlaylistClick(playlist.playlist_id)}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={playlist.image || "https://via.placeholder.com/140"} // Replace with your default image if no URL is available
                        alt={playlist.name}
                      />

                      <CardContent sx={{
                        bgcolor: 'black'
                      }}>

                        <Stack direction="row" spacing={2}
                        sx={{
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                        }}>
                        <Typography gutterBottom variant="h6" component="div"
                        color={'primary'}>
                        {(playlist.playlist_name.length > 22) ?
                          playlist.playlist_name.substring(0, 21) + '...' : playlist.playlist_name
                        }
                        </Typography>
                        </Stack>
                        <Box>
                        <Stack sx= {{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                          spacing: 1

                        }}>
                        <Typography variant="subtitle1" color="secondary.light">
                          by {playlist.author}
                        </Typography>
                        <Typography variant="subtitle2" color="secondary">
                          {playlist.tracks} tracks
                        </Typography>
                        </Stack>

                        </Box>

                      </CardContent>

                      </CardActionArea>
                      <CardActions sx={{
                                        bgcolor: 'gray'
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
      </Box>
      </ThemeProvider>
    );
  }
  export default Dashboard;
