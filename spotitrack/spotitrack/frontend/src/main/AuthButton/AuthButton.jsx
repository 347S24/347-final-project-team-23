// Material-UI Components
import { Button } from "@mui/material";

import SpotifyLogo from "../login_signup/assets/spotify-logo.svg";

const callOAuth = async () => {
  try {
    const response = await fetch("/users/api/authorization", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let authorizationUrl = await response.text();
    authorizationUrl = authorizationUrl.replace(/^"|"$/g, "");
    console.log("Authorization URL:", authorizationUrl);
    window.location = authorizationUrl;
    console.log(window.location);
  } catch (error) {
    console.error("Failed to fetch authorization URL:", error);
  }
};

const AuthButton = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        padding: "40px", // Adjust padding as needed
        display: "flex", // Ensures the icon centers in the button
        justifyContent: "center",
      }}
      onClick={callOAuth}
    >
      <img
        src={SpotifyLogo}
        alt="Spotify logo"
        style={{
          width: "80px", // Adjust size as needed
          height: "80px", // Adjust size as needed
        }}
      />
    </Button>
  );
};

export default AuthButton;
