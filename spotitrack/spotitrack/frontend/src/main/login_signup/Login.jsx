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

import './../../index.css'
import './style.css'

function Login() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div id='Login'>
      <Typography
        variant="h3"
        color="secondary"
        component="h3"
        id="login-header">
        Login
      </Typography>
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
      color="secondary"
      size="large">
        Login
      </Button>
      <p id="signup-prompt">
        Don&apos;t have an account? <a href='/signup' id="inline-link">Sign up</a>
      </p>
    </div>
  )
}
export default Login;
