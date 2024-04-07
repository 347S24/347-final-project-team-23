import Typography from '@mui/material/Typography';

import './../../index.css'
import './style.css'


function Confirmation() {
  return (
    // create a page that prompts the user to check their email for a confirmation link
    <div id='confirmation'>
      <Typography
        variant="h3"
        color="secondary"
        component="h3"
        id="confirmation-header">
        Check your email
      </Typography>
      <Typography
        variant="h5"
        color="secondary"
        component="h5"
        id="confirmation-subheader">
        We&apos;ve sent you a confirmation link. Please check your email to continue.
      </Typography>
      <p id="signup-prompt">
      <a href='/' id="inline-link">Click here</a> to retun home
      </p>
    </div>
  );
}

export default Confirmation;
