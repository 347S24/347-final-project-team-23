import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, AlertTitle } from "@mui/material"; // Import the 'Alert' component from the '@mui/material' package
import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';



Signup.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Signup(props) {
  // STATE MANAGEMENT FUCNTIONS
  const theme = props.theme;

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // STATE MANAGEMENT FOR FORM INPUTS

  const [username, setUsername] = React.useState("");
  const handleSetUsername = (event) => {
    setUsername(event.target.value);
    console.log("username: " + username);
  };
  const [usernameError, setUsernameError] = React.useState(false);
  const handleSetUsernameError = () => setUsernameError((error) => !error);

  const [firstName, setFirstName] = React.useState("");
  const handleSetFirstName = (event) => {
    setFirstName(event.target.value);
    console.log("first name: " + firstName);
  };
  const [firstNameError, setFirstNameError] = React.useState(false);
  const handleSetFirstNameError = () => setFirstNameError((error) => !error);

  const [lastName, setLastName] = React.useState("");
  const handleSetLastName = (event) => {
    setLastName(event.target.value);
    console.log("last name: " + lastName);
  };
  const [lastNameError, setLastNameError] = React.useState(false);
  const handleSetLastNameError = () => setLastNameError((error) => !error);

  const [password, setPassword] = React.useState("");
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
    console.log("password " + password);
  };
  const [passwordError, setPasswordError] = React.useState(false);
  const handleSetPasswordError = () => setPasswordError((error) => !error);

  const [weakPassword, setWeakPassword] = React.useState(false);
  const handleWeakPasswordError = () => setWeakPassword((error) => !error);

  const [verifyPassword, setVerifyPassword] = React.useState("");
  const handleVerifyPassword = (event) => {
    setVerifyPassword(event.target.value);
    console.log("verify password: " + verifyPassword);
  };
  const [verifyPasswordError, setVerifyPasswordError] = React.useState(false);
  const handleSetVerifyPasswordError = () =>
    setVerifyPasswordError((error) => !error);

  const [email, setEmail] = React.useState("");
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
    console.log("email: " + email);
  };
  const [emailError, setEmailError] = React.useState(false);
  const handleSetEmailError = () => setEmailError((error) => !error);

  // ERROR HANDLING STATE MANAGEMENT

  const [error, setError] = React.useState(false);
  const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
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

      // API CALLS TO SERVER

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
        });
      navigate("/login")
    }
    console.log("fetch done");
  };

  return (
    <div id="Login">
    <ThemeProvider theme={theme}>
      {/* Error handling -- make more robust if time */}
      {(weakPassword) && <Alert severity="error" style={{textAlign: "left"}}>Weak Password!
          <ul style={{alignItems: "left"}}>
            <li>Your password can't be too similar to your other personal information.</li>
            <li>Your Password must contain at least 8 characters.</li>
            <li>Your password can't be a commonly used password.</li>
            <li>Your password can't be entirely numeric.</li>
          </ul>
        </Alert>}
      
      {(error || usernameError || firstNameError || lastNameError
        || passwordError || verifyPasswordError || emailError)
        && <Alert severity="error">Fill all required fields</Alert>
      }

      {/* Heading for the page */}
      <Typography
        variant="h3"
        color="primary"
        component="h3"
        id="login-header"
      >
        Sign up
      </Typography>

      {/* form begin */}
      <form onSubmit={handleFormSubmission}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
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
              <InputLabel htmlFor="outlined-adornment-email">email</InputLabel>
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
      <p id="signup-prompt">
        Already have an account?{" "}
        <a href="/login" id="inline-link">
          Login
        </a>
      </p>
      </ThemeProvider>
    </div>
  );
}
export default Signup;
