// import { useEffect } from "react";


// using the playlist api to get the user's playlists
  /*
  useEffect (async () => {
    const username = 'Sacr3d'
    const res = await fetch(`/users/api/playlist?username=${username}`)
    const data = await res.json()
    console.log(data)
  }, [])
  */
  import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Button from "@mui/material/Button";


  function Dashboard() {


    useEffect (async () => {
      const username = 'Sacr3d'
      const res = await fetch(`/users/api/playlist?username=${username}`)
      const data = await res.json()
      console.log(data)
    }, [])

    useEffect(() => {
      const username = 'Sacr3d';
      const playlist_id = '7AqyxOJ8sodMKovIVWqvDV';
      const fetchUrl = `/users/api/tracks/${username}/${playlist_id}?username=${username}&playlist_id=${playlist_id}`;

      const fetchData = async () => {
          const res = await fetch(fetchUrl);
          const data = await res.json();
          console.log(data); // Log full data to see the structure
          if (data.tracks && data.tracks.length > 0) {
              console.log(data.tracks[0].album.artUrl);
          }
      };

      fetchData();
  }, []);


    const location = useLocation();
    console.log("Location state:", location.state);
    const user = location.state ? location.state.user : null;

    const username = user.username;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const email = user.email;
    const password = user.password;

    console.log("The users information is: ", username, first_name, last_name, email, password)

    if (!user) {
      // Handle the scenario when no user data is passed
      console.log("No user data available.");
      return <div>No user data available. Please login again.</div>;
    }

    const callOAuth = async () => {
      try {
          // Call the API endpoint to get the authorization URL
          const response = await fetch('/users/api/authorization', {
              method: 'GET', // Method itself is GET by default, so this is optional
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          let authorizationUrl = await response.text();
          authorizationUrl = authorizationUrl.replace(/^"|"$/g, '');
          console.log('Authorization URL:', authorizationUrl);

          // Redirect the user to the authorization URL obtained from the API
          window.location = authorizationUrl;
      } catch (error) {
          console.error('Failed to fetch authorization URL:', error);
      }
  };

    return (
      <div>
        <h1>Welcome, {user.first_name}!</h1>
        <p>your name is {user.first_name} {user.last_name}</p>
        <p>your email is {user.email}</p>
        <p>your username is {user.username}</p>
        <p>your password is {user.password}</p>
        <Button variant="contained"
        color="primary"
        onClick={callOAuth}>
        oAuth
        </Button>
      </div>
    );
  }
  export default Dashboard;
