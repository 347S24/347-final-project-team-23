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
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
      onClick={callOAuth}
    >
      <img
        src={SpotifyLogo}
        alt="Spotify logo"
        style={{
          width: "80px",
          height: "80px",
        }}
      />
    </Button>
  );
};

export default AuthButton;
