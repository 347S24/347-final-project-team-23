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


  // fetch('/users/api/signup', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ zipCode: zipCode })
  // })
  // .then(response => response.json())
  // .then(data => {
  //     console.log('Weather Data:', data);
  // .catch(error => {
  //     console.error('Error:', error);
  //     document.getElementById('weatherResult').textContent = 'Invalid ZIP Code';
  // });




  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [error, setError] = React.useState(false);
  const handleSetError = () => setError((error) => !error);

  const [username, setUsername] = React.useState('');
  const handleSetUsername = (event) => {
    setUsername(event.target.value);
    console.log("username: " + username);
  }

  const [firstName, setFirstName] = React.useState('');
  const handleSetFirstName = (event) => {
    setFirstName(event.target.value);
    console.log("first name: " + firstName);
  }

  const [lastName, setLastName] = React.useState('');
  const handleSetLastName = (event) => {
    setLastName(event.target.value);
    console.log("last name: " + lastName);
  }

  const [password, setPassword] = React.useState('');
  const handleSetPassword = (event) => {
    setPassword(event.target.value);
    console.log("password " + password);
  }

  const [verifyPassword, setVerifyPassword] = React.useState('');
  const handleVerifyPassword = (event) => {
    setVerifyPassword(event.target.value);
    console.log("verify password: " + verifyPassword);
  }

  const [email, setEmail] = React.useState('');
  const handleSetEmail = (event) => {
    setEmail(event.target.value);
    console.log("email: " + email);
  }

  const handleFormSubmission = (event) => {
    event.preventDefault();
    console.log("username: " + username);
    console.log("first name: " + firstName);
    console.log("last name: " + lastName);
    console.log("password: " + password);
    console.log("verify password: " + verifyPassword);
    console.log("email: " + email);
    console.log("form submitted");
  }



  return (
    <div id='Login'>
    <Typography
      variant="h3"
      color="secondary"
      component="h3"
      id="login-header">
      Sign up
    </Typography>
    <form onSubmit={handleFormSubmission}>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div className='form'>


      <FormControl onChange={handleSetUsername}  // This is the username field
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
        <FormControl onChange={handleSetFirstName}  // This is the first name field
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

          <FormControl onChange={handleSetLastName}  // This is the last name field
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
          <FormControl  onChange={handleSetPassword}  // This is the password field
            sx={{ m: 1, width: '25ch' }}
            variant="outlined"
            color='secondary'
            required
          >
            <InputLabel
            htmlFor="outlined-adornment-password">Password
            </InputLabel>
            <OutlinedInput
              autoComplete="new-password"
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

          <FormControl onChange={handleVerifyPassword}  // This is the confirm password field
            autoComplete="new-password"
            sx={{ m: 1, width: '25ch' }}
            variant="outlined"
            color='secondary'
            required
          >
            <InputLabel
            htmlFor="outlined-adornment-confirm-password">Confirm Password
            </InputLabel>
            <OutlinedInput
              autoComplete="new-password"
              id="outlined-adornment-confirm-password"
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
              label="Confirm Password"
            />
          </FormControl>
        </div>

        <FormControl onChange={handleSetEmail}  // This is the email field
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
            autoComplete='email'
            id="outlined-adornment-email"
            type="email"
            label="email"
          />
        </FormControl>



      </div>
    </Box>
    <Button
    // onClick={handleFormSubmission}
    id="signup_button"
    variant="contained"
    // href="/confirm_email"
    color="secondary"
    type="submit"
    size="large">
      Sign Up
    </Button>
    </form>
    <p id="signup-prompt">
      Already have an account? <a href='/login' id="inline-link">Login</a>
    </p>
  </div>
  );
}
export default Signup;
