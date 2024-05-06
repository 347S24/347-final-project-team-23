import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Link,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../../UserProvider";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";

function TopArtists() {
  const { user } = useUser();
  const [artists, setArtists] = useState([]);
  const theme = useTheme();
  const [followedArtists, setFollowedArtists] = useState(new Set());

  const show1 = useMediaQuery(theme.breakpoints.down(1278));
  // const show2 = useMediaQuery(theme.breakpoints.between(713, 1012));
  const show4 = useMediaQuery(theme.breakpoints.up(1278));

  let numToShow = 1;
  if (show1) {
    numToShow = 1;
  }
  // else if (show2) {
  //   numToShow = 2;
  // }
  else if (show4) {
    numToShow = 2;
  }

  useEffect(() => {
    async function fetchData() {
      const headers = {
        Authorization: `Bearer ${user.access_token}`,
      };

      const limit = 4;
      const res = await fetch(
        `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=${limit}&offset=0`,
        { headers }
      );
      const data = await res.json();

      if (res.ok) {
        setArtists(data.items);
      } else {
        throw new Error("Failed to fetch top artists");
      }
    }

    if (user?.access_token) {
      fetchData();
    }
  }, [user.access_token]); // Ensure dependencies are correctly listed

  const toggleFollowArtist = async (artistId, isFollowed) => {
    const headers = {
      Authorization: `Bearer ${user.access_token}`,
      "Content-Type": "application/json",
    };
    const method = isFollowed ? "DELETE" : "PUT";
    const body = JSON.stringify({ ids: [artistId] });

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/me/following?type=artist`,
        { headers, method, body }
      );
      if (res.ok) {
        const newFollowed = new Set(followedArtists);
        if (isFollowed) {
          newFollowed.delete(artistId);
        } else {
          newFollowed.add(artistId);
        }
        setFollowedArtists(newFollowed);
      } else {
        throw new Error("Failed to change follow status");
      }
    } catch (error) {
      console.error("Error in toggling follow status", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, justifyContent: "center", alignContent: "center" }}>
      <Typography variant="h4" gutterBottom>
        Your Top Artists This Week
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {artists.slice(0, numToShow).map((artist) => (
          <Grid
            item
            xs={6}
            key={artist.id}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card sx={{ width: 300, height: 500, position: "relative" }}>
              <CardMedia
                component="img"
                sx={{ height: 300, width: 300, objectFit: "cover" }}
                image={artist.images[0]?.url || "/default_artist_image.jpg"}
                alt={artist.name}
              />
              <IconButton
                onClick={() =>
                  toggleFollowArtist(artist.id, followedArtists.has(artist.id))
                }
                sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
              >
                {followedArtists.has(artist.id) ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </IconButton>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{artist.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Genres: {artist.genres.slice(0, 3).join(", ")}
                </Typography>
                <Link
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener"
                  sx={{ mt: "auto" }}
                >
                  Listen on Spotify
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TopArtists;
