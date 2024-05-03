import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useUser } from "../../../UserProvider";
function TopArtists() {
  const { user } = useUser();
  useEffect(() => {
    async function fetchData() {
      try {
        // Set up the request headers with the authorization token
        const headers = {
          Authorization: `Bearer ${user.access_token}`,
        };

        // Make the API request to get the top artists
        const res = await fetch(
          "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=5&offset=0",
          {
            headers,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch top artists");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch top artists", error);
      }
    }

    fetchData();
  }, [user.access_token]);

  return (
    <Box>
      <Typography variant="h4">Top Artists</Typography>
    </Box>
  );
}

export default TopArtists;
