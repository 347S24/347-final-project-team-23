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




function Signup() {

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
      Sign up
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
          required
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

      <div className='name'>
        <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="outlined"
          color='secondary'
          required
          >
            <InputLabel
            htmlFor="outlined-adornment-first-name">First Name
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-first-name"
              type="text"
              label="First Name"
            />
          </FormControl>

          <FormControl
          sx={{ m: 1, width: '25ch' }}
          variant="outlined"
          color='secondary'
          required
          >
            <InputLabel
            htmlFor="outlined-adornment-last-name">Last Name
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-last-name"
              type="text"
              label="Last Name"
            />
          </FormControl>
        </div>

        {/* Password field with show/hide password */}
        <div className='password'>
          <FormControl
            sx={{ m: 1, width: '25ch' }}
            variant="outlined"
            color='secondary'
            required
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

          <FormControl
            sx={{ m: 1, width: '25ch' }}
            variant="outlined"
            color='secondary'
            required
          >
            <InputLabel
            htmlFor="outlined-adornment-confirm-password">Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={showPassword ? 'text' : 'Confirm Password'}
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
          sx={{ m:1, width: '52ch' }}
          variant="outlined"
          FullWidth
          color='secondary'
          required
        >
          <InputLabel
          htmlFor="outlined-adornment-email">email
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-email"
            type="email"
            label="email"
          />
        </FormControl>



      </div>
    </Box>
    <Button
    id="signup_button"
    variant="contained"
    href="/confirm_email"
    color="secondary"
    size="large">
      Sign Up
    </Button>
    <p id="signup-prompt">
      Already have an account? <a href='/login' id="inline-link">Login</a>
    </p>
  </div>
  );
}
export default Signup;
