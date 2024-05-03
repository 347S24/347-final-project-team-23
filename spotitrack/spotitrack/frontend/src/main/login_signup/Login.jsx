// React imports
import React from "react";

// React Router DOM
import { useNavigate } from "react-router-dom";

// Material-UI Components
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  Link,
  Alert,
  ThemeProvider,
  Stack,
} from "@mui/material";
import { useUser } from "./../../UserProvider.jsx";

// Material-UI Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";

function Login() {
  const theme = useTheme();

  const navigate = useNavigate();
  const { user, login } = useUser();

  // Error, show password, click states
  const [error, setError] = React.useState(false);
  const handleSetError = () => setError((error) => !error);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Username and password state
  const [username, setUsername] = React.useState("");
  const handleSetUsername = (event) => {
    setUsername(event.target.value);
  };

  const [password, setPassword] = React.useState("");
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
  };

  // Form submission handler
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (username === "" || password === "") {
      setError(true);
      return;
    }
    fetch("/users/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(true); // Set a state to show an error message
        } else {
          login(data.user);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError(true);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "top",
        spacing: 20,
        padding: "40px",
        width: "100%",
        height: "100%",
      }}
    >
      <ThemeProvider theme={theme}>
        {error && (
          <Alert severity="error">Username or password incorrect</Alert>
        )}

        <Typography
          variant="h3"
          color="primary"
          component="h3"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "top",
            spacing: 20,
            paddingTop: "150px",
          }}
        >
          Login
        </Typography>

        <form onSubmit={handleFormSubmit}>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "top",
              spacing: 20,
              padding: "40px",
            }}
          >
            <div className="form">
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "top",
                  spacing: 20,
                  padding: "10px",
                }}
              >
                {/* Username form control */}
                <FormControl
                  onChange={handleSetUsername}
                  sx={{ m: 1, width: "52ch" }}
                  variant="outlined"
                  FullWidth
                  color="primary"
                  error={error}
                >
                  <InputLabel htmlFor="outlined-adornment-username">
                    Username
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-username"
                    type="username"
                    label="username"
                  />
                </FormControl>

                {/* Password form control */}
                <FormControl
                  onChange={handleSetPassword}
                  sx={{ m: 1, width: "52ch" }}
                  variant="outlined"
                  color="primary"
                  error={error}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    autoComplete="current-password"
                    label="Password"
                  />
                </FormControl>
              </Stack>
            </div>
          </Box>

          {/* Submit form */}
          <Button
            id="login_button"
            variant="contained"
            type="submit"
            color="primary"
            size="large"
          >
            Login
          </Button>
        </form>
        <Typography
          variant="p"
          sx={{
            spacing: 20,
            padding: "40px",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/signup" underline="hover">
            {" "}
            {"Sign up"}
          </Link>
        </Typography>
      </ThemeProvider>
    </Box>
  );
}

export default Login;
