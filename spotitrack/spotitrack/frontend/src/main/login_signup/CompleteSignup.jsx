import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const CompleteSignup = () => {
const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const userData = JSON.parse(sessionStorage.getItem('tempUserData'));
    
    // Combine user data with tokens and send to backend to create the user
    const completeUserData = {
        ...userData,
        access_token,
        refresh_token
    };
    fetch('/users/api/create_user_with_spotify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeUserData)
    }).then(response => response.json())
    .then(data => {
      console.log('User created:', data);
      sessionStorage.removeItem('tempUserData'); // Cleanup
      navigate('/dashboard'); // Redirect to dashboard// Redirect to dashboard
    });
  }, []);




  return (
    <div>Signup done
    <h1>its done</h1>
    </div>
  )
}

export default CompleteSignup
