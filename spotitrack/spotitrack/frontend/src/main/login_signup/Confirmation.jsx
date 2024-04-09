import Typography from '@mui/material/Typography';

import './../../index.css'
import './style.css'
import { useEffect } from 'react';


function Confirmation() {
  useEffect(async () => {
    const artist = 'DMX'
    const res = await fetch(`/users/api/about?artist_name=${artist}`)
    const data = await res.json()
    console.log(data)
  },[])
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
      <a href='/' id="inline-link">Click here</a> to return home
      </p>
    </div>
  );
}

export default Confirmation;
