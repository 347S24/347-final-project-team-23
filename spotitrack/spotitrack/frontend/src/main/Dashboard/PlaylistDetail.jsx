import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Badge, CardMedia, Box, IconButton, Stack } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { toUnitless } from '@mui/material/styles/cssUtils';

function PlaylistDetail() {
  const location = useLocation();
  const { playlistId } = location.state || {};
  const [trackDetails, setTrackDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingUrl, setPlayingUrl] = useState('');
  const [playlistInfo, setPlaylistInfo] = useState({});
  const [audio] = useState(new Audio());
  const user = location.state ? location.state.user : null;
  console.log(user);

  useEffect(() => {
    const fetchPlaylistInfo = async () => {
      try {
        const accessToken = user.access_token; // Replace this with your actual method to get the access token
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch playlist details');
        const data = await response.json();
        setPlaylistInfo({
          name: data.name,
          owner: data.owner.display_name,
          tracks: data.tracks.total,
          image: data.images[0].url // Using the first image (largest size)
        });
      } catch (error) {
        setError('Failed to load playlist details: ' + error.message);
      }
    };

    if (playlistId) {
      fetchPlaylistInfo();
    }
  }, [playlistId]);


  useEffect(() => {
    async function fetchTrackDetails() {
      try {
        const res = await fetch(`/users/api/tracks/?playlist_id=${playlistId}`);
        if (!res.ok) throw new Error('Failed to fetch track details');
        const data = await res.json();
        setTrackDetails(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load tracks: ' + error.message);
        setLoading(false);
      }
    }

    if (playlistId) {
      fetchTrackDetails();
    }
  }, [playlistId]);

  console.log(playlistId);

  useEffect(() => {
    audio.src = playingUrl;
    playingUrl ? audio.play() : audio.pause();
  }, [playingUrl, audio]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const togglePlay = (url) => {
    if (playingUrl === url) {
      setPlayingUrl('');
    } else {
      setPlayingUrl(url);
    }
  };

  return (
    <Box sx={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

    }}>
      <Card sx={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
    <CardMedia
      component="img"
      sx={{ width: 151, height: 151 }}
      image={playlistInfo.image || 'https://via.placeholder.com/150'}
      alt="Playlist Cover"
    />
    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {playlistInfo.name || 'Playlist Details'}
      </Typography>
      <Typography variant="h5" gutterBottom>
        Owned by: {playlistInfo.owner || 'Unknown'}
      </Typography>
      <Typography variant="button">
        {playlistInfo.tracks || 0} Tracks
      </Typography>
    </CardContent>
  </Card>





      <Grid container spacing={2}>
      {trackDetails.map((track, index) => (
        <Grid item xs={12} key={index}>
          <Badge badgeContent={index + 1} max={999} color="secondary" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <Card raised sx={{ display: 'flex', height: 151, width: 450 }}>
              <CardMedia
                component="img"
                sx={{ width: 151, height: 151 }}
                image={track.album_art_url || 'https://via.placeholder.com/150'}
                alt={`${track.name} album cover`}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', overflow: 'hidden' }}>
                <Stack spacing={0.5}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: 250,
                  overflow: 'hidden'

                }}>
                  <Typography variant="h5" noWrap>
                    {(track.name.length > 24) ?
                      track.name.substring(0, 23) + '...' : track.name
                    }
                  </Typography>
                  <Typography variant="subtitle1" noWrap>
                    {track.artists.join(', ')}
                  </Typography>
                  <Typography color="textSecondary" variant="subtitle2" noWrap>
                    {track.album}
                  </Typography>
                  <Typography color="textSecondary" variant="caption" noWrap>
                    {track.duration}
                  </Typography>
                </Stack>
                {track.preview_url && (
                  <IconButton onClick={() => togglePlay(track.preview_url)} color="primary">
                    <PlayCircleOutlineIcon />
                  </IconButton>
                )}
              </CardContent>
            </Card>
          </Badge>
        </Grid>
      ))}
    </Grid>
    </Box>

  );
}

export default PlaylistDetail;
