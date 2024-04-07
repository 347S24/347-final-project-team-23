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
import Alert from '@mui/material/Alert';

import './../../index.css'
import './style.css'

function Login() {

  const [error, setError] = React.useState(false);
  const handleSetError = () => setError((error) => !error);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [username, setUsername] = React.useState('');
  const handleSetUsername = (event) => setUsername(event.target.value);

  const [password, setPassword] = React.useState('');
  const handleSetPassword = (event) => setPassword(event.target.value);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      handleSetError();
      return;
    } else {
      console.log('Form submitted');
    }
  }

  return (
    <div id='Login'>
      {error && <Alert severity="error">Username or password incorrect</Alert>}
      <Typography
        variant="h3"
        color="secondary"
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
          <FormControl
            sx={{ m:1, width: '52ch' }}
            variant="outlined"
            FullWidth
            color='secondary'
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

          <FormControl
            sx={{ m: 1, width: '52ch' }}
            variant="outlined"
            color='secondary'
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
              label="Password"
            />
          </FormControl>
          </div>
        </Box>

        <Button
          id="login_button"
          variant="contained"
          type='submit'
          color="secondary"
          size="large"
        >
          Login
        </Button>
      </form>
      <p id="signup-prompt">
          Don&apos;t have an account? <a href='/signup' id="inline-link">Sign up</a>
        </p>
    </div>
  )
}

export default Login;
