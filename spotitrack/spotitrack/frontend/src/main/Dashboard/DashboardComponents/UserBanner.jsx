import { useEffect, useState } from "react";
import { useUser } from "../../../UserProvider";
import { Card, CardMedia, Typography, Box } from "@mui/material";

function UserBanner() {
  const { updateUser, user } = useUser();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const cachedProfile = localStorage.getItem("spotifyProfile");

    if (cachedProfile) {
      setProfile(JSON.parse(cachedProfile));
    } else {
      fetchProfile();
    }
  }, [user.access_token]); // Depend on user.access_token to refetch if it changes

  async function fetchProfile() {
    if (!user?.access_token || user.spotify_id) return;

    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      setProfile(data);
      localStorage.setItem("spotifyProfile", JSON.stringify(data));

      if (!user.spotify_id) {
        updateUser({ spotify_id: data.id });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: 151,
          height: 151,
          borderRadius: "50%",
        }}
        image={
          profile.images.reduce((highest, image) => {
            if (
              !highest ||
              (image.height > highest.height && image.width > highest.width)
            ) {
              return image;
            }
            return highest;
          }, null)?.url ||
          "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
        }
        alt="User avatar"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ml: 2,
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h5" component="div">
          {profile.display_name || "Spotify User"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Followers: {profile.followers.total.toLocaleString()}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Subscription: {profile.product}
        </Typography>
      </Box>
    </Card>
  );
}

export default UserBanner;
