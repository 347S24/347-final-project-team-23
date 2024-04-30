import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert'
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/system";
import PropTypes from 'prop-types';

import './../../index.css'
import './style.css'

Login.propTypes = {
  theme: PropTypes.object.isRequired,
};

function Login(props) {

  const theme = props.theme;
  const navigate = useNavigate();


  const [error, setError] = React.useState(false);
  const handleSetError = () => setError((error) => !error);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [username, setUsername] = React.useState('');
  const handleSetUsername = (event) => {
    setUsername(event.target.value);
    console.log(username);
  }

  const [password, setPassword] = React.useState('');
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
    console.log(password);
  }

  // const [user, setUser] = React.useState(null);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (username === '' || password === '') {
        setError(true);
        return;
    }
    console.log('Logging in with:', username, password);
    fetch('/users/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    })
    .then(data => {
        if (data.error) {
            setError(true);  // Set a state to show an error message
        } else {
            navigate('/dashboard', { state: { user: data.user } });
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        setError(true);
    });
};



  return (
    <div id='Login'>
    <ThemeProvider theme={theme}>
      {error && <Alert severity="error">Username or password incorrect</Alert>}
      <Typography
        variant="h3"
        color="primary"
        component="h3"
        id="login-header">
        Login
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div className='form'>
          <FormControl onChange={handleSetUsername}
            sx={{ m:1, width: '52ch' }}
            variant="outlined"
            FullWidth
            color='primary'
            error = {error}
          >
            <InputLabel
            htmlFor="outlined-adornment-username">Username
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-username"
              type="username"
              label="username"
            />
          </FormControl>

          <FormControl onChange={handleSetPassword}
            sx={{ m: 1, width: '52ch' }}
            variant="outlined"
            color='primary'
            error = {error}
          >
            <InputLabel
            htmlFor="outlined-adornment-password">Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
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
          </div>
        </Box>

        <Button
          id="login_button"
          variant="contained"
          type='submit'
          color="primary"
          size="large"
        >
          Login
        </Button>
      </form>
      <p id="signup-prompt">
          Don&apos;t have an account? <a href='/signup' id="inline-link">Sign up</a>
        </p>
        </ThemeProvider>
    </div>
  )
}

export default Login;
