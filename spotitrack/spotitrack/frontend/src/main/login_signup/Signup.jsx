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
} from "@mui/material";

// Material-UI Icons
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import React from "react";
import { useTheme } from "@mui/material/styles";

function Signup() {
  // Theme and user variables
  const theme = useTheme();
  let user = null;
  const navigate = useNavigate();

  // Password visibility and click states
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Form field state managmeent
  const [username, setUsername] = React.useState("");
  const handleSetUsername = (event) => {
    setUsername(event.target.value);
    console.log("username: " + username);
  };

  const [firstName, setFirstName] = React.useState("");
  const handleSetFirstName = (event) => {
    setFirstName(event.target.value);
    console.log("first name: " + firstName);
  };

  const [lastName, setLastName] = React.useState("");
  const handleSetLastName = (event) => {
    setLastName(event.target.value);
    console.log("last name: " + lastName);
  };

  const [password, setPassword] = React.useState("");
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
    console.log("password " + password);
  };

  const handleVerifyPassword = (event) => {
    setVerifyPassword(event.target.value);
    console.log("verify password: " + verifyPassword);
  };
  const [email, setEmail] = React.useState("");
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
    console.log("email: " + email);
  };

  // Form field error state management
  const [usernameError, setUsernameError] = React.useState(false);
  const handleSetUsernameError = () => setUsernameError((error) => !error);

  const [firstNameError, setFirstNameError] = React.useState(false);
  const handleSetFirstNameError = () => setFirstNameError((error) => !error);

  const [lastNameError, setLastNameError] = React.useState(false);
  const handleSetLastNameError = () => setLastNameError((error) => !error);

  const [passwordError, setPasswordError] = React.useState(false);
  const handleSetPasswordError = () => setPasswordError((error) => !error);

  const [weakPassword, setWeakPassword] = React.useState(false);
  const handleWeakPasswordError = () => setWeakPassword((error) => !error);

  const [verifyPassword, setVerifyPassword] = React.useState("");

  const [verifyPasswordError, setVerifyPasswordError] = React.useState(false);
  const handleSetVerifyPasswordError = () =>
    setVerifyPasswordError((error) => !error);

  const [emailError, setEmailError] = React.useState(false);
  const handleSetEmailError = () => setEmailError((error) => !error);

  // ERROR HANDLING STATE MANAGEMENT
  const [error, setError] = React.useState(false);
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  // Error handling
  const handleSetError = () =>
    setError(() => {
      if (username === "") {
        handleSetUsernameError();
      }
      if (firstName === "") {
        handleSetFirstNameError();
      }
      if (lastName === "") {
        handleSetLastNameError();
      }
      if (password === "") {
        handleSetPasswordError();
      }
      if (!password.match(passwordRegex)) {
        handleWeakPasswordError();
      }
      if (verifyPassword === "") {
        handleSetVerifyPasswordError();
      }
      if (email === "") {
        handleSetEmailError();
      }
    });

  // FORM SUBMISSION HANDLER

  const handleFormSubmission = (event) => {
    if (!error) {
      event.preventDefault();
    } else {
      // Problem when pressing sign-up twice.
      // Not super important, but I'll figure it out.
      if (weakPassword) setWeakPassword(false);
    }

    if (
      username === "" ||
      firstName == "" ||
      lastName == "" ||
      password === "" ||
      !password.match(passwordRegex) ||
      // password !== verifyPassword ||
      email === ""
    ) {
      handleSetError();
    } else {
      // Create a user object
      fetch("/users/api/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          password: password,
          email: email,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User info: ", data);
        })
        .then(() => {
          fetch("users/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          }).then((response) => {
            user = response.json();
            console.log("User info: ", user);
          });
        })
        .then(() => {
          console.log("attempting to navigate");
          navigate("/authorize_spotify", { state: { user: user } });
        });
    }
    console.log("fetch done");
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
        {/* Error handling -- make more robust if time */}
        {weakPassword && (
          <Alert severity="error" style={{ textAlign: "left" }}>
            Weak Password!
            <ul style={{ alignItems: "left" }}>
              <li>
                Your password can&apos;t be too similar to your other personal
                information.
              </li>
              <li>Your Password must contain at least 8 characters.</li>
              <li>Your password can&apos;t be a commonly used password.</li>
              <li>Your password can&apos;t be entirely numeric.</li>
            </ul>
          </Alert>
        )}

        {(error ||
          usernameError ||
          firstNameError ||
          lastNameError ||
          passwordError ||
          verifyPasswordError ||
          emailError) && (
          <Alert severity="error">Fill all required fields</Alert>
        )}

        {/* Heading for the   page */}
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
          Sign up
        </Typography>

        {/* form begin */}
        <form onSubmit={handleFormSubmission}>
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
              <FormControl
                onChange={handleSetUsername} // This is the username field
                sx={{ m: 1, width: "52ch" }}
                variant="outlined"
                FullWidth
                color="primary"
                required
                error={usernameError}
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

              {/* First name and last name fields */}
              <div className="name">
                <FormControl
                  onChange={handleSetFirstName} // This is the first name field
                  sx={{ m: 1, width: "25ch" }}
                  variant="outlined"
                  color="primary"
                  required
                  error={firstNameError}
                >
                  <InputLabel htmlFor="outlined-adornment-first-name">
                    First Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-first-name"
                    type="text"
                    label="First Name"
                  />
                </FormControl>

                <FormControl
                  onChange={handleSetLastName} // This is the last name field
                  sx={{ m: 1, width: "25ch" }}
                  variant="outlined"
                  color="primary"
                  required
                  error={lastNameError}
                >
                  <InputLabel htmlFor="outlined-adornment-last-name">
                    Last Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-last-name"
                    type="text"
                    label="Last Name"
                  />
                </FormControl>
              </div>

              {/* Password field with show/hide password */}
              <div className="password">
                <FormControl
                  onChange={handleSetPassword} // This is the password field
                  sx={{ m: 1, width: "25ch" }}
                  variant="outlined"
                  color="primary"
                  required
                  error={passwordError}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    autoComplete="new-password"
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
                    label="Password"
                  />
                </FormControl>

                <FormControl
                  onChange={handleVerifyPassword} // This is the confirm password field
                  autoComplete="new-password"
                  sx={{ m: 1, width: "25ch" }}
                  variant="outlined"
                  color="primary"
                  required
                  error={verifyPasswordError}
                >
                  <InputLabel htmlFor="outlined-adornment-confirm-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    autoComplete="new-password"
                    id="outlined-adornment-confirm-password"
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
                    label="Confirm Password"
                  />
                </FormControl>
              </div>

              <FormControl
                onChange={handleSetEmail} // This is the email field
                sx={{ m: 1, width: "52ch" }}
                variant="outlined"
                FullWidth
                color="primary"
                required
                error={emailError}
              >
                <InputLabel htmlFor="outlined-adornment-email">
                  email
                </InputLabel>
                <OutlinedInput
                  autoComplete="email"
                  id="outlined-adornment-email"
                  type="email"
                  label="email"
                />
              </FormControl>
            </div>
          </Box>
          <Button
            onClick={handleFormSubmission}
            id="signup_button"
            variant="contained"
            // href="/authorize_spotify"
            color="primary"
            type="submit"
            size="large"
          >
            Sign Up
          </Button>
        </form>
        <Typography
          variant="p"
          sx={{
            spacing: 20,
            padding: "40px",
          }}
        >
          Already have an account?{" "}
          <Link href="/login" underline="hover">
            {" "}
            {"Login"}
          </Link>
        </Typography>
      </ThemeProvider>
    </Box>
  );
}
export default Signup;
